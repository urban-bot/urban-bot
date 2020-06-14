---
id: telegram
title: UrbanBotTelegram
sidebar_label: Telegram
---
**Urban bot part which is responsible to launch <a href="https://telegram.org/" target="_blank">telegram</a> bot.**
#### Install
```shell
npm i @urban-bot/telegram --save
```
```shell
yarn add @urban-bot/telegram
```
#### Usage
```javascript
import { render, Root, Text } from '@urban-bot/core';
import { UrbanBotTelegram } from '@urban-bot/telegram';

const urbanBotTelegram = new UrbanBotTelegram({
    token: 'telegramToken',
});

render(
    <Root bot={urbanBotTelegram}>
        <Text>Hello, Telegram!</Text>
    </Root>,
);
```

## Options
#### token
> A telegram token. You can get it from <a href="https://t.me/botfather" target="_blank">@BotFather</a>.

###### required
`string`
```javascript
const urbanBotTelegram = new UrbanBotTelegram({
    token: '323452248:YYHG68zEKHl2NWQ5c_y1l9blh5wXmn385u4',
});
```
#### isPolling
> Enabling [long polling](https://core.telegram.org/bots/api#getupdates).

###### optional
###### default `false`
`boolean`
```javascript
const urbanBotTelegram = new UrbanBotTelegram({
    isPolling: true,
});
```
## Bot Instance
You could get bot instance by `useBotContext`.
```jsx
function SomeComponent() {
    const { bot } = useBotContext();

    // ...
}
```
#### type  
> Bot type.

###### required
`'TELEGRAM'` 

#### client 
> A client which you can use for call any <a href="https://core.telegram.org/bots/api#available-methods" target="_blank">Telegram API</a>.

###### required
<a href="https://github.com/yagop/node-telegram-bot-api/blob/master/doc/api.md" target="_blank">`node-telegram-bot-api`</a>
```jsx
function SomeComponent() {
    const { bot } = useBotContext();
    
    useText(({ text, chat, from }) => {
        if (text.includes('Fu**')) {
            bot.client.kickChatMember(chat.id, from.id);
        }
    });

    // ...
}
```
