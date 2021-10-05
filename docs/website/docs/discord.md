---
id: discord
title: UrbanBotDiscord
sidebar_label: Discord
---
**Urban bot part which is responsible to launch <a href="https://discord.com/" target="_blank">discord</a> bot.**
#### Install
```shell
npm i @urban-bot/discord --save
```
```shell
yarn add @urban-bot/discord
```
#### Usage
```javascript
import { render, Root, Text } from '@urban-bot/core';
import { UrbanBotDiscord } from '@urban-bot/discord';

const urbanBotDiscord = new UrbanBotDiscord({
    token: 'discordToken',
    intents: ['GUILDS', 'GUILD_MESSAGES', 'DIRECT_MESSAGES', 'DIRECT_MESSAGE_REACTIONS'],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});

render(
    <Root bot={urbanBotDiscord}>
        <Text>Hello, Discord!</Text>
    </Root>,
);
```

## Options
#### token
> A discord token. You can get it from <a href="https://discord.com/developers/applications/PASTE_YOUR_ID/bot" target="_blank">https://discord.com/developers/applications/PASTE_YOUR_ID/bot</a>

###### required
`string`
```javascript
const urbanBotDiscord = new UrbanBotDiscord({
    token: 'ODg8MDEzODM3NDU3OTEzODU5.YUMhVA.YdPFx-QL1iwWeczrIV1A2-53XoQ',
});
```
#### intents
> Discord bot intents <a href="https://discordjs.guide/popular-topics/intents.html#privileged-intents" target="_blank">https://discordjs.guide/popular-topics/intents.html#privileged-intents</a>. 

###### required
`string[]`
```javascript
const urbanBotDiscord = new UrbanBotDiscord({
    intents: ['GUILDS', 'GUILD_MESSAGES', 'DIRECT_MESSAGES', 'DIRECT_MESSAGE_REACTIONS'],
});
```
#### partials
> Discord bot partials <a href="https://discordjs.guide/popular-topics/partials.html#enabling-partials" target="_blank">https://discordjs.guide/popular-topics/partials.html#enabling-partials</a>

###### optional
`string[]`
```javascript
const urbanBotDiscord = new UrbanBotDiscord({
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});
```
#### other
All options from <a href="https://discord.js.org/#/docs/main/stable/typedef/ClientOptions" target="_blank">https://discord.js.org/#/docs/main/stable/typedef/ClientOptions</a>
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
`'DISCORD'` 

#### nativeEvent 
> A nativeEvent which you can use for call any <a href="https://discord.js.org/#/docs/main/stable/general/welcome" target="_blank">Discord.js API</a>.

###### required
<a href="https://discord.js.org/" target="_blank">`discord.js`</a>
```jsx
function SomeComponent() {
    useText(({ text, nativeEvent }) => {
        if (text.includes('Fu**')) {
            nativeEvent.payload?.member?.kick();
        }
    });

    // ...
}
```
