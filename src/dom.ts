import { shallowEqual } from './utils/shallowEqual';
import { UrbanExistingMessage, UrbanMessageNodeName, UrbanMessage } from './types/Messages';
import { ManagerBot } from './ManagerBot/ManagerBot';

export type UrbanNode<Type, NativeEventPayload, MessageMeta> = Omit<UrbanExistingMessage<MessageMeta>, 'meta'> & {
    $$managerBot: ManagerBot<Type, NativeEventPayload, MessageMeta>;
    isNewMessageEveryRender?: boolean;
    meta?: Promise<MessageMeta>;
};

export type UrbanNodeRoot = {
    nodeName: 'root';
};

type Props<Type, NativeEventPayload, MessageMeta> = Omit<UrbanNode<Type, NativeEventPayload, MessageMeta>, 'nodeName'>;

export function createNode<Type, NativeEventPayload, MessageMeta>(
    nodeName: UrbanMessageNodeName | 'root',
    props?: Props<Type, NativeEventPayload, MessageMeta>,
): UrbanNode<Type, NativeEventPayload, MessageMeta> | UrbanNodeRoot {
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
    } as UrbanNode<Type, NativeEventPayload, MessageMeta>;
}

export function appendChildNode<Type, NativeEventPayload, MessageMeta>(
    _node: UrbanNode<Type, NativeEventPayload, MessageMeta> | UrbanNodeRoot,
    childNode: UrbanNode<Type, NativeEventPayload, MessageMeta> | UrbanNodeRoot,
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

export function removeChildNode<Type, NativeEventPayload, MessageMeta>(
    _node: UrbanNode<Type, NativeEventPayload, MessageMeta>,
    removedNode: UrbanNode<Type, NativeEventPayload, MessageMeta>,
) {
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
        } as UrbanExistingMessage<MessageMeta>;

        removedNode.$$managerBot.deleteMessage(message);
    });
}

export function updateNode<Type, NativeEventPayload, MessageMeta>(
    node: UrbanNode<Type, NativeEventPayload, MessageMeta>,
    _updatePayload: unknown,
    _type: unknown,
    oldProps: Props<Type, NativeEventPayload, MessageMeta>,
    newProps: Props<Type, NativeEventPayload, MessageMeta>,
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
            const existingMessage: UrbanExistingMessage<MessageMeta> = {
                ...message,
                meta,
            };

            newNode.$$managerBot.updateMessage(existingMessage);
        });
    }
}
