import { shallowEqual } from './utils/shallowEqual';
import { UrbanExistingMessage, UrbanMessageNodeName, UrbanMessage } from './types/Messages';
import { ManagerBot } from './ManagerBot/ManagerBot';
import { UrbanBot } from './types/UrbanBot';
import { BotMetaByBot } from './hooks/hooks';
import debouncePromise from 'debounce-promise';

export type UrbanNode<Bot extends UrbanBot = any> = Omit<
    UrbanExistingMessage<BotMetaByBot<Bot>['MessageMeta']>,
    'meta'
> & {
    $$managerBot: ManagerBot<Bot>;
    isNewMessageEveryRender?: boolean;
    debounceDelay?: number;
    meta?: Promise<BotMetaByBot<Bot>['MessageMeta']>;
    sendMessage: ManagerBot<Bot>['sendMessage'];
    updateMessage: ManagerBot<Bot>['updateMessage'];
    deleteMessage: ManagerBot<Bot>['deleteMessage'];
    childNodes: Array<UrbanNode>;
};

export type UrbanNodeRoot = {
    nodeName: 'root';
    childNodes: Array<UrbanNode>;
};

type Props<Bot extends UrbanBot> = Omit<UrbanNode<Bot>, 'nodeName'>;

export function createNode<Bot extends UrbanBot>(
    nodeName: UrbanMessageNodeName | 'root',
    props?: Props<Bot>,
): UrbanNode<Bot> | UrbanNodeRoot {
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
    } as UrbanNode<Bot>;
}

export function appendChildNode<Bot extends UrbanBot>(
    parentNode: UrbanNode<Bot> | UrbanNodeRoot,
    childNode: UrbanNode<Bot>,
) {
    parentNode.childNodes.push(childNode);

    const message = {
        nodeName: childNode.nodeName,
        chat: childNode.chat,
        data: childNode.data,
    } as UrbanMessage;

    childNode.meta = childNode.sendMessage(message);
}

export function removeChildNode<Bot extends UrbanBot>(parentNode: UrbanNode<Bot>, removedNode: UrbanNode<Bot>) {
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
        } as UrbanExistingMessage<BotMetaByBot<Bot>['MessageMeta']>;

        removedNode.deleteMessage(message);
    });
}

export const insertBeforeNode = (node: UrbanNode, newChildNode: UrbanNode, beforeChildNode: UrbanNode) => {
    const beforeChildNodeIndex = node.childNodes.findIndex((childNode) => childNode === beforeChildNode);
    const nodesAfterInserted = node.childNodes.filter((_childNode, index) => index >= beforeChildNodeIndex);
    nodesAfterInserted.forEach((nodeAfterInserted) => {
        removeChildNode(node, nodeAfterInserted);
    });
    appendChildNode(node, newChildNode);
    nodesAfterInserted.forEach((nodeAfterInserted) => {
        appendChildNode(node, nodeAfterInserted);
    });
};

export function updateNode<Bot extends UrbanBot>(
    node: UrbanNode<Bot>,
    _updatePayload: unknown,
    _type: unknown,
    oldProps: Props<Bot>,
    newProps: Props<Bot>,
) {
    const { data: oldPropsData, ...oldPropsWithoutData } = oldProps;
    const { data: newPropsData, ...newPropsWithoutData } = newProps;

    if (
        !node.isNewMessageEveryRender &&
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

    if (node.isNewMessageEveryRender) {
        node.meta = newNode.sendMessage(message);
    } else {
        if (node.meta === undefined) {
            throw new Error('sendMessage should return Promise with message meta data to enable updating it.');
        }

        node.meta.then((meta) => {
            const existingMessage: UrbanExistingMessage<BotMetaByBot<Bot>['MessageMeta']> = {
                ...message,
                meta,
            };

            newNode.updateMessage(existingMessage);
        });
    }
}
