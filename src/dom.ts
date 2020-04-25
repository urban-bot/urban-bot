import { shallowEqual } from './utils/shallowEqual';
import { UrbanExistingMessage, UrbanMessageNodeName, UrbanMessage } from './types/Messages';
import { ManagerBot } from './ManagerBot/ManagerBot';
import { UrbanNativeEvent } from './types/Events';

export type UrbanNode<NativeEvent extends UrbanNativeEvent, MessageMeta> = Omit<
    UrbanExistingMessage<MessageMeta>,
    'meta'
> & {
    $$managerBot: ManagerBot<NativeEvent, MessageMeta>;
    isNewMessageEveryRender?: boolean;
    meta?: Promise<MessageMeta>;
};

export type UrbanNodeRoot = {
    nodeName: 'root';
};

type Props<NativeEvent extends UrbanNativeEvent, MessageMeta> = Omit<UrbanNode<NativeEvent, MessageMeta>, 'nodeName'>;

export function createNode<NativeEvent extends UrbanNativeEvent, MessageMeta>(
    nodeName: UrbanMessageNodeName | 'root',
    props?: Props<NativeEvent, MessageMeta>,
): UrbanNode<NativeEvent, MessageMeta> | UrbanNodeRoot {
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
    } as UrbanNode<NativeEvent, MessageMeta>;
}

export function appendChildNode<NativeEvent extends UrbanNativeEvent, MessageMeta>(
    _node: UrbanNode<NativeEvent, MessageMeta> | UrbanNodeRoot,
    childNode: UrbanNode<NativeEvent, MessageMeta> | UrbanNodeRoot,
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

export function removeChildNode<NativeEvent extends UrbanNativeEvent, MessageMeta>(
    _node: UrbanNode<NativeEvent, MessageMeta>,
    removedNode: UrbanNode<NativeEvent, MessageMeta>,
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

export function updateNode<NativeEvent extends UrbanNativeEvent, MessageMeta>(
    node: UrbanNode<NativeEvent, MessageMeta>,
    _updatePayload: unknown,
    _type: unknown,
    oldProps: Props<NativeEvent, MessageMeta>,
    newProps: Props<NativeEvent, MessageMeta>,
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
