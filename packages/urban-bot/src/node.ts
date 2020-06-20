import { shallowEqual } from './utils/shallowEqual';
import { UrbanExistingMessage, UrbanMessageNodeName, UrbanMessage } from './types/Messages';
import { ManagerBot } from './ManagerBot/ManagerBot';
import { UrbanBotType } from './types/UrbanBot';
import debouncePromise from 'debounce-promise';

export type UrbanNode<BotType extends UrbanBotType = UrbanBotType> = Omit<UrbanExistingMessage<BotType>, 'meta'> & {
    $$managerBot: ManagerBot<BotType>;
    isNewMessageEveryRender?: boolean;
    debounceDelay?: number;
    meta?: Promise<BotType['MessageMeta']>;
    sendMessage: ManagerBot<BotType>['sendMessage'];
    updateMessage: ManagerBot<BotType>['updateMessage'];
    deleteMessage: ManagerBot<BotType>['deleteMessage'];
    childNodes: Array<UrbanNode<BotType>>;
};

export type UrbanNodeRoot = {
    nodeName: 'root';
    childNodes: Array<UrbanNode>;
};

type Props<BotType extends UrbanBotType> = Omit<UrbanNode<BotType>, 'nodeName'>;

export function createNode<BotType extends UrbanBotType>(
    nodeName: UrbanMessageNodeName | 'root',
    props?: Props<BotType>,
): UrbanNode<BotType> | UrbanNodeRoot {
    if (props === undefined) {
        if (nodeName !== 'root') {
            throw new Error('props are necessary for every node');
        }

        return { nodeName, childNodes: [] };
    }
    const { $$managerBot, chat, isNewMessageEveryRender, data, debounceDelay = 50 } = props;
    const node = {
        nodeName,
        $$managerBot,
        chat,
        isNewMessageEveryRender,
        sendMessage: debouncePromise($$managerBot.sendMessage.bind($$managerBot), debounceDelay),
        updateMessage: debouncePromise($$managerBot.updateMessage.bind($$managerBot), debounceDelay),
        deleteMessage: $$managerBot.deleteMessage.bind($$managerBot),
    };

    return {
        ...node,
        childNodes: [],
        data,
    } as UrbanNode<BotType>;
}

export function appendChildNode<BotType extends UrbanBotType>(
    parentNode: UrbanNode<BotType> | UrbanNodeRoot,
    childNode: UrbanNode<BotType>,
) {
    // FIXME: fix types.
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    parentNode.childNodes.push(childNode);

    const message = {
        nodeName: childNode.nodeName,
        chat: childNode.chat,
        data: childNode.data,
    } as UrbanMessage;

    childNode.meta = childNode.sendMessage(message);
}

export function removeChildNode<BotType extends UrbanBotType>(
    parentNode: UrbanNode<BotType>,
    removedNode: UrbanNode<BotType>,
) {
    parentNode.childNodes = parentNode.childNodes.filter((node) => node !== removedNode);

    if (removedNode.isNewMessageEveryRender) {
        return;
    }

    if (removedNode.meta === undefined) {
        throw new Error('sendMessage should return Promise with message meta data to enable removing it.');
    }

    removedNode.meta.then((meta) => {
        const message = {
            nodeName: removedNode.nodeName,
            chat: removedNode.chat,
            data: removedNode.data,
            meta,
        } as UrbanExistingMessage<BotType>;

        removedNode.deleteMessage(message);
    });
}

export function insertBeforeNode(node: UrbanNode, newChildNode: UrbanNode, beforeChildNode: UrbanNode) {
    const beforeChildNodeIndex = node.childNodes.findIndex((childNode) => childNode === beforeChildNode);
    const nodesAfterInserted = node.childNodes.filter((_childNode, index) => index >= beforeChildNodeIndex);
    nodesAfterInserted.forEach((nodeAfterInserted) => {
        removeChildNode(node, nodeAfterInserted);
    });
    appendChildNode(node, newChildNode);
    nodesAfterInserted.forEach((nodeAfterInserted) => {
        appendChildNode(node, nodeAfterInserted);
    });
}

export function updateNode<BotType extends UrbanBotType>(
    node: UrbanNode<BotType>,
    _updatePayload: unknown,
    _type: unknown,
    oldProps: Props<BotType>,
    newProps: Props<BotType>,
) {
    const { data: oldPropsData, ...oldPropsWithoutData } = oldProps;
    const { data: newPropsData, ...newPropsWithoutData } = newProps;

    if (
        !newProps.isNewMessageEveryRender &&
        shallowEqual(oldPropsWithoutData, newPropsWithoutData) &&
        shallowEqual(oldPropsData, newPropsData)
    ) {
        return;
    }

    const newNode = { ...node, isNewMessageEveryRender: newProps.isNewMessageEveryRender, data: newProps.data };

    const message = {
        nodeName: newNode.nodeName,
        chat: newNode.chat,
        data: newNode.data,
    } as UrbanMessage;

    if (newNode.isNewMessageEveryRender) {
        node.meta = newNode.sendMessage(message);
    } else {
        if (node.meta === undefined) {
            throw new Error('sendMessage should return Promise with message meta data to enable updating it.');
        }

        node.meta.then((meta) => {
            const existingMessage: UrbanExistingMessage<BotType> = {
                ...message,
                meta,
            };

            newNode.updateMessage(existingMessage);
        });
    }
}
