---
id: slack
title: UrbanBotSlack
sidebar_label: Slack
---
**Urban bot part which is responsible to launch <a href="https://slack.com/" target="_blank">slack</a> bot.**
#### Install
```shell
npm i @urban-bot/slack --save
```
```shell
yarn add @urban-bot/slack
```
#### Usage
```javascript
import { render, Root, Text } from '@urban-bot/core';
import { UrbanBotSlack } from '@urban-bot/slack';

const urbanBotSlack = new UrbanBotSlack({
    signingSecret: 'signingSecret',
    token: 'token',
});

render(
    <Root bot={urbanBotSlack}>
        <Text>Hello, Slack!</Text>
    </Root>,
);
```

## Options
#### signingSecret
> A slack signingSecret. You can get it from <a href="https://api.slack.com/apps/<YOUR_APP_ID>/general" target="_blank">https://api.slack.com/apps/<YOUR_APP_ID>/general</a>.

###### required
`string`
```javascript
const urbanBotSlack = new UrbanBotSlack({
    signingSecret: '6e7cf4e2fen267af5810e3a34gfcb254',
});
```
#### token
> A slack token. You can get it from <a href="https://api.slack.com/apps/<YOUR_APP_ID>/oauth" target="_blank">https://api.slack.com/apps/<YOUR_APP_ID>/oauth</a>.

###### required
`string`
```javascript
const urbanBotSlack = new UrbanBotSlack({
    token: 'xoxb-1034561432512-1264285621449-nadENxhBj2BfrMkxJ90cqbuz',
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
`'SLACK'` 

#### client 
> A client which you can use for call any <a href="https://api.slack.com/methods" target="_blank">Slack API</a>.

###### required
<a href="https://github.com/slackapi/node-slack-sdk/tree/master/packages/web-api" target="_blank">`slack/web-api`</a>
```jsx
function SomeComponent() {
    const { bot } = useBotContext();
    
   useText(({ text, chat, from }) => {
       if (text.includes('Fu**')) {
           bot.client.conversations.kick({
               channel: chat.id,
               user: from.id,
           });
       }
   });

    // ...
}
```
