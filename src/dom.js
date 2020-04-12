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
        removedNode.bot.deleteMessage(node.nodeName, meta.chat.id, meta);
    });
}

export function updateNode(node, updatePayload, type, oldProps, newProps) {
    if (!node.isNewMessageEveryRender && shallowEqual(oldProps, newProps)) {
        return;
    }

    if (node.isNewMessageEveryRender) {
        node = createNode(node.nodeName, newProps);
        node.meta = node.bot.sendMessage(node.nodeName, node.chatId, node.data);
    } else {
        node.meta.then((meta) => {
            const node = createNode(node.nodeName, newProps);
            node.bot.updateMessage(node.nodeName, node.chatId, node.data, meta);
        });
    }
}
