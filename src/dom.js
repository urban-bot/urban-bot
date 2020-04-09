import { shallowEqual } from './utils/shallowEqual';

export function createNode(type, props = {}) {
    const node = {
        nodeName: type,
        bot: props.bot,
        chatId: props.chatId,
        isNewMessageEveryRender: props.isNewMessageEveryRender,
    };

    switch (type) {
        case 'root': {
            return node;
        }
        case 'text': {
            return {
                ...node,
                data: {
                    text: props.text,
                    params: props.params,
                },
            };
        }
        case 'img': {
            return {
                ...node,
                data: {
                    src: props.src,
                    params: props.params,
                },
            };
        }
        default: {
            throw new Error('tag ' + type + ' does not exist');
        }
    }
}

export function appendChildNode(node, childNode) {
    switch (childNode.nodeName) {
        case 'text': {
            childNode.meta = childNode.bot.sendMessage(childNode.chatId, childNode.data.text, childNode.data.params);

            break;
        }
        case 'img': {
            childNode.meta = childNode.bot.sendPhoto(childNode.chatId, childNode.data.src, childNode.data.params);

            break;
        }
        default: {
            throw new Error('tag ' + childNode.nodeName + ' does not exist');
        }
    }
}

export function removeChildNode(node, removedNode) {
    if (removedNode.isNewMessageEveryRender) {
        return;
    }

    removedNode.meta.then((meta) => {
        removedNode.bot.deleteMessage(meta.chat.id, meta.message_id);
    });
}

export function updateNode(node, updatePayload, type, oldProps, newProps) {
    if (!node.isNewMessageEveryRender && shallowEqual(oldProps, newProps)) {
        return;
    }

    switch (node.nodeName) {
        case 'text': {
            if (node.isNewMessageEveryRender) {
                node = createNode(node.nodeName, newProps);

                node.meta = node.bot.sendMessage(node.chatId, node.data.text, node.data.params);
            } else {
                node.meta.then((meta) => {
                    const metaToEdit = {
                        chat_id: meta.chat.id,
                        message_id: meta.message_id,
                    };

                    const params = newProps.params || {};

                    node.bot.editMessageText(newProps.text, { ...params, ...metaToEdit });
                });
            }

            break;
        }
        case 'img': {
            if (node.isNewMessageEveryRender) {
                node = createNode(node.nodeName, newProps);

                node.meta = node.bot.sendPhoto(node.chatId, node.data.src, node.data.params);
            } else {
                node.meta.then((meta) => {
                    const metaToEdit = {
                        chat_id: meta.chat.id,
                        message_id: meta.message_id,
                    };

                    const media = {
                        type: 'photo',
                        media: newProps.src,
                        ...(newProps.params || {}),
                    };

                    node.bot.editMessageMedia(media, { ...media, ...metaToEdit });
                });
            }

            break;
        }
        default: {
            throw new Error('tag ' + node.nodeName + ' does not exist');
        }
    }
}
