import { shallowEqual } from './utils/shallowEqual';

export function createNode(type, props = {}) {
    const { bot, chatId, isNewMessageEveryRender, ...messageProps } = props;
    const node = {
        nodeName: type,
        bot,
        chatId,
        isNewMessageEveryRender,
    };

    return {
        ...node,
        data: messageProps,
    };
}

export function appendChildNode(node, childNode) {
    childNode.meta = childNode.bot.sendMessage(childNode.nodeName, childNode.chatId, childNode.data);
}

export function removeChildNode(node, removedNode) {
    if (removedNode.isNewMessageEveryRender) {
        return;
    }

    removedNode.meta.then((meta) => {
        removedNode.bot.deleteMessage(node.nodeName, node.chatId, node.data, meta);
    });
}

export function updateNode(node, updatePayload, type, oldProps, newProps) {
    if (!node.isNewMessageEveryRender && shallowEqual(oldProps, newProps)) {
        return;
    }

    const newNode = createNode(node.nodeName, newProps);

    if (node.isNewMessageEveryRender) {
        node.meta = newNode.bot.sendMessage(newNode.nodeName, newNode.chatId, newNode.data);
    } else {
        node.meta.then((meta) => {
            newNode.bot.updateMessage(newNode.nodeName, newNode.chatId, newNode.data, meta);
        });
    }
}
