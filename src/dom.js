export function createNode(type, props) {
    if (type === 'message') {
        return {
            nodeName: type.toUpperCase(),
            bot: props.bot,
            data: {
                text: props.text,
                params: props.params,
            },
            userId: props.userId,
        };
    }
}

export function appendChildNode(node, childNode) {
    const meta = childNode.bot.sendMessage(childNode.userId, childNode.data.text, childNode.data.params);

    childNode.meta = meta;
}

export function removeChildNode(node, removedNode) {
    removedNode.meta.then((meta) => {
        removedNode.bot.deleteMessage(meta.chat.id, meta.message_id);
    });
}

export function updateNode(node, updatePayload, type, oldProps, newProps) {
    node.meta.then((meta) => {
        const options = {
            chat_id: meta.chat.id,
            message_id: meta.message_id,
        };

        const params = newProps.params || {};

        node.bot.editMessageText(newProps.text, { ...params, ...options });
    });
}
