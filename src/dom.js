import { shallowEqual } from './utils';

export function createNode(type, props = {}) {
    const node = {
        nodeName: type,
        bot: props.bot,
        userId: props.userId,
    };

    switch (type) {
        case 'root': {
            return node;
        }
        case 'message': {
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
            throw new Error('tag ' + type + ' is not exist');
        }
    }
}

export function appendChildNode(node, childNode) {
    switch (childNode.nodeName) {
        case 'message': {
            childNode.meta = childNode.bot.sendMessage(childNode.userId, childNode.data.text, childNode.data.params);

            break;
        }
        case 'img': {
            childNode.meta = childNode.bot.sendPhoto(childNode.userId, childNode.data.src, childNode.data.params);

            break;
        }
        default: {
            throw new Error('tag ' + childNode.nodeName + ' is not exist');
        }
    }
}

export function removeChildNode(node, removedNode) {
    removedNode.meta.then((meta) => {
        removedNode.bot.deleteMessage(meta.chat.id, meta.message_id);
    });
}

export function updateNode(node, updatePayload, type, oldProps, newProps) {
    if (shallowEqual(oldProps, newProps)) {
        return;
    }

    switch (node.nodeName) {
        case 'message': {
            node.meta.then((meta) => {
                const metaToEdit = {
                    chat_id: meta.chat.id,
                    message_id: meta.message_id,
                };

                const params = newProps.params || {};

                node.bot.editMessageText(newProps.text, { ...params, ...metaToEdit });
            });

            break;
        }
        case 'img': {
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

            break;
        }
        default: {
            throw new Error('tag ' + node.nodeName + ' is not exist');
        }
    }
}
