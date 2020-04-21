import { shallowEqual } from './utils/shallowEqual';
import { UrbanExistingMessage, UrbanMessageNodeName, UrbanNewMessage } from './types/Messages';
import { ManagerBot } from './ManagerBot/ManagerBot';

export type UrbanNode<Type, NativeEventPayload, Meta> = Omit<UrbanExistingMessage<Meta>, 'meta'> & {
    $$managerBot: ManagerBot<Type, NativeEventPayload, Meta>;
    isNewMessageEveryRender?: boolean;
    meta?: Promise<Meta>;
};

export type UrbanNodeRoot = {
    nodeName: 'root';
};

type Props<Type, NativeEventPayload, Meta> = Omit<UrbanNode<Type, NativeEventPayload, Meta>, 'nodeName'>;

export function createNode<Type, NativeEventPayload, Meta>(
    nodeName: UrbanMessageNodeName | 'root',
    props?: Props<Type, NativeEventPayload, Meta>,
): UrbanNode<Type, NativeEventPayload, Meta> | UrbanNodeRoot {
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
    } as UrbanNode<Type, NativeEventPayload, Meta>;
}

export function appendChildNode<Type, NativeEventPayload, Meta>(
    _node: UrbanNode<Type, NativeEventPayload, Meta> | UrbanNodeRoot,
    childNode: UrbanNode<Type, NativeEventPayload, Meta> | UrbanNodeRoot,
) {
    if (childNode.nodeName === 'root') {
        return;
    }

    const message = {
        nodeName: childNode.nodeName,
        chat: childNode.chat,
        data: childNode.data,
    } as UrbanNewMessage;

    childNode.meta = childNode.$$managerBot.sendMessage(message);
}

export function removeChildNode<Type, NativeEventPayload, Meta>(
    _node: UrbanNode<Type, NativeEventPayload, Meta>,
    removedNode: UrbanNode<Type, NativeEventPayload, Meta>,
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
        } as UrbanExistingMessage<Meta>;

        removedNode.$$managerBot.deleteMessage(message);
    });
}

export function updateNode<Type, NativeEventPayload, Meta>(
    node: UrbanNode<Type, NativeEventPayload, Meta>,
    _updatePayload: unknown,
    _type: unknown,
    oldProps: Props<Type, NativeEventPayload, Meta>,
    newProps: Props<Type, NativeEventPayload, Meta>,
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
    } as UrbanNewMessage;

    if (node.isNewMessageEveryRender) {
        node.meta = newNode.$$managerBot.sendMessage(message);
    } else {
        if (node.meta === undefined) {
            throw new Error('sendMessage should return Promise with message meta data to enable updating it.');
        }

        node.meta.then((meta) => {
            const existingMessage: UrbanExistingMessage<Meta> = {
                ...message,
                meta,
            };

            newNode.$$managerBot.updateMessage(existingMessage);
        });
    }
}
