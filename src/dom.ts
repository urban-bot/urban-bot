import { shallowEqual } from './utils/shallowEqual';
import { UrbanExistingMessage, UrbanMessageNodeName, UrbanMessage } from './types/Messages';
import { ManagerBot } from './ManagerBot/ManagerBot';
import { UrbanBot } from './types/UrbanBotInstance';

export type UrbanNode<Bot extends UrbanBot> = Omit<UrbanExistingMessage<Bot['MessageMeta']>, 'meta'> & {
    $$managerBot: ManagerBot<Bot>;
    isNewMessageEveryRender?: boolean;
    meta?: Promise<Bot['MessageMeta']>;
};

export type UrbanNodeRoot = {
    nodeName: 'root';
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

        return { nodeName };
    }
    const { $$managerBot, chat, isNewMessageEveryRender, data } = props;
    const node = {
        nodeName,
        $$managerBot,
        chat,
        isNewMessageEveryRender,
    };

    return {
        ...node,
        data,
    } as UrbanNode<Bot>;
}

export function appendChildNode<Bot extends UrbanBot>(
    _node: UrbanNode<Bot> | UrbanNodeRoot,
    childNode: UrbanNode<Bot> | UrbanNodeRoot,
) {
    if (childNode.nodeName === 'root') {
        return;
    }

    const message = {
        nodeName: childNode.nodeName,
        chat: childNode.chat,
        data: childNode.data,
    } as UrbanMessage;

    childNode.meta = childNode.$$managerBot.sendMessage(message);
}

export function removeChildNode<Bot extends UrbanBot>(_node: UrbanNode<Bot>, removedNode: UrbanNode<Bot>) {
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
        } as UrbanExistingMessage<Bot['MessageMeta']>;

        removedNode.$$managerBot.deleteMessage(message);
    });
}

export function updateNode<Bot extends UrbanBot>(
    node: UrbanNode<Bot>,
    _updatePayload: unknown,
    _type: unknown,
    oldProps: Props<Bot>,
    newProps: Props<Bot>,
) {
    if (!node.isNewMessageEveryRender && shallowEqual(oldProps, newProps)) {
        return;
    }

    const newNode = createNode(node.nodeName, newProps);

    if (newNode.nodeName === 'root') {
        throw new Error("root nodeName shouldn't update");
    }

    const message = {
        nodeName: newNode.nodeName,
        chat: newNode.chat,
        data: newNode.data,
    } as UrbanMessage;

    if (node.isNewMessageEveryRender) {
        node.meta = newNode.$$managerBot.sendMessage(message);
    } else {
        if (node.meta === undefined) {
            throw new Error('sendMessage should return Promise with message meta data to enable updating it.');
        }

        node.meta.then((meta) => {
            const existingMessage: UrbanExistingMessage<Bot['MessageMeta']> = {
                ...message,
                meta,
            };

            newNode.$$managerBot.updateMessage(existingMessage);
        });
    }
}
