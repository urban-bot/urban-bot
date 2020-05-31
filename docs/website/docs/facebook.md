---
id: facebook
title: UrbanBotFacebook
sidebar_label: Facebook
---
**Urban bot part which is responsible to launch <a href="https://www.messenger.com/" target="_blank">facebook</a> bot.**
#### Install
```shell
npm i @urban-bot/facebook --save
```
```shell
yarn add @urban-bot/facebook
```
#### Usage
```javascript
import { render, Root, Text } from '@urban-bot/core';
import { UrbanBotFacebook } from '@urban-bot/facebook';

const urbanBotFacebook = new UrbanBotFacebook({
    appSecret: 'appSecret',
    pageAccessToken: 'pageAccessToken',
    verifyToken: 'verifyToken',
});

render(
    <Root bot={urbanBotFacebook}>
        <Text>Hello, Facebook!</Text>
    </Root>,
);
```

## Options
#### appSecret
> A facebook app secret. You can get it from **Dashboard -> Settings -> Basic** <a href="https://developers.facebook.com/apps/<YOUR_APP_ID>/settings/basic/" target="_blank">https://developers.facebook.com/apps/<YOUR_APP_ID>/settings/basic/</a>.

###### required
`string`
```javascript
const urbanBotFacebook = new UrbanBotFacebook({
    appSecret: '436dea778f91b26ba2d082389a9eh951',
});
```
#### pageAccessToken
> A facebook page access token. You can get it from **Messenger -> Settings -> Access Tokens** <a href="https://developers.facebook.com/apps/<YOUR_APP_ID>/messenger/settings/" target="_blank">https://developers.facebook.com/apps/<YOUR_APP_ID>/messenger/settings/</a>.

###### required
`string`
```javascript
const urbanBotFacebook = new UrbanBotFacebook({
    pageAccessToken: 'EAAIQg0zUkrEBoDSMInBbCf5OwU9TXhUTTUTPWZBdGqvrATyoIKEOphkGKQAl...',
});
```
#### verifyToken
> A random string that is used to connect facebook bot and your webhook url. Invent it yourself and after starting your bot set it to **Messenger -> Settings -> Webhooks** <a href="https://developers.facebook.com/apps/<YOUR_APP_ID>/messenger/settings/" target="_blank">https://developers.facebook.com/apps/<YOUR_APP_ID>/messenger/settings/</a>. 
###### required
`string`
```javascript
const urbanBotFacebook = new UrbanBotFacebook({
    verifyToken: 'randomString',
});
```
