// import EventEmitter from 'events';



export class AbstractBot {
    constructor(bot) {
      //  console.log('Initial Bot ');
        // will be array bots
        this.bot = bot;

        this.listaners = new Map();
    }

    on(messageType, callback) {
       // console.log('on ', messageType);
        if(!this.listaners.has(messageType)) {
            this.listaners.set(messageType, new Set());
        }

        this.listaners.get(messageType).add((...props) => {
           // console.log(`call ${messageType}`, props)
            callback(...props);
        });
       // return this.bot.on(...args);
    }

    emit(messageType, props) {

        if(this.listaners.has(messageType)) {
            this.listaners.get(messageType).forEach((callback) => {
                callback(props);
            });
        }
       // return this.bot.emit(...args);
    }

    removeListener(messageType, callback) {
     //   console.log('removeListener ', messageType);
        if(this.listaners.has(messageType)) {
            this.listaners.get(messageType).delete(callback);
        }
      // return this.bot.removeListener(messageType, callback);
    }

    sendMessage(userId, text, value) {
        // return this.bot.sendMessage(userId, text, value);
        // console.log('sendMessage ', {userId, text});
        return Promise.resolve({
            chat: {
                id: userId
            },
            message_id: '22222',
        })
    }

    editMessageText(text, options) {
      //  console.log('editMessageText ', {text, options});
      //  return this.bot.editMessageText(text, options);
    }

    deleteMessage(chat_id, message_id) {
       // console.log('deleteMessage ', {chat_id, message_id});
       // return this.bot.deleteMessagechat_id, message_id);
    }

    async sendPhoto(userId, src, params) {
      //  console.log('sendPhoto ', {userId});
        // return this.bot.sendPhoto(...args);
        return Promise.resolve({
            chat: {
                id: userId
            },
            message_id: '22222',
        })
    }

    editMessageMedia(media, options) {
     //   console.log('editMessageMedia ');
        // return this.bot.editMessageMedia(media, options);
    }
}
