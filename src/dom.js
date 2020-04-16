import { shallowEqual } from './utils/shallowEqual';

export function createNode(type, props = {}) {
    const { $$managerBot, chat, isNewMessageEveryRender, ...messageProps } = props;
    const node = {
        nodeName: type,
        $$managerBot,
        chat,
        isNewMessageEveryRender,
    };

    return {
        ...node,
        data: messageProps,
    };
}

export function appendChildNode(node, childNode) {
    childNode.meta = childNode.$$managerBot.sendMessage(childNode.nodeName, childNode.chat, childNode.data);
}

export function removeChildNode(node, removedNode) {
    if (removedNode.isNewMessageEveryRender) {
        return;
    }

    removedNode.meta.then((meta) => {
        removedNode.$$managerBot.deleteMessage(removedNode.nodeName, removedNode.chat, removedNode.data, meta);
    });
}

export function updateNode(node, updatePayload, type, oldProps, newProps) {
    if (!node.isNewMessageEveryRender && shallowEqual(oldProps, newProps)) {
        return;
    }

    const newNode = createNode(node.nodeName, newProps);

    if (node.isNewMessageEveryRender) {
        node.meta = newNode.$$managerBot.sendMessage(newNode.nodeName, newNode.chat, newNode.data);
    } else {
        node.meta.then((meta) => {
            newNode.$$managerBot.updateMessage(newNode.nodeName, newNode.chat, newNode.data, meta);
        });
    }
}
