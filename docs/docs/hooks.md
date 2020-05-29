---
id: hooks
title: Hooks 
sidebar_label: Hooks
---
**Available react hooks. Use it to subscrube to user actions or get an application data.**

All variables you can import from `@urban-bot/core`.  
```javascript
import { useBotContext, useText } from '@urban-bot/core';  
```
```javascript
const { useBotContext, useText } = require('@urban-bot/core');  
```  

## Navigation
 * [Common](#common)
 * [useBotContext](#usebotcontext)
 * [useRouter](#userouter)
 * [useAnyEvent](#useanyevent)
 
## Common
#### chat
> Information about the chat.
```jsx
function SomeComponent() {
    useText(({ chat }) => {
        console.log('message from chat id', chat.id);
    });

    // ...
}
```
```typescript
id: string;
type?: string;
title?: string;
username?: string;
firstName?: string;
lastName?: string;
description?: string;
inviteLink?: string;
```
#### from
> Information about who send the message.
```jsx
function SomeComponent() {
    useAnyEvent(({ from }) => {
        console.log('message from user id', from.id);
    });

    // ...
}
```
```typescript
id?: string;
isBot?: boolean;
username?: string;
firstName?: string;
lastName?: string;
```

#### nativeEvent
> Native event data from the specific messenger.
```jsx
function SomeComponent() {
    useImage(({ nativeEvent }) => {
        console.log('this message from messenger', nativeEvent.type);
        // do stuff with nativeEvent.payload
    });

    // ...
}
```
```typescript
type: string; // 'TELEGRAM' || 'FACEBOOK' || ...
payload?: any;
```
If you develop some messengers you can divide behavior by comparing type.
```jsx
import { UrbanBotTelegram } from '@urban-bot/telegram';
import { UrbanBotFacebook } from '@urban-bot/facebook';

function SomeComponent() {
    useText(({ nativeEvent }) => {
        if (nativeEvent.type === UrbanBotTelegram.type) {
            console.log('this message from telegram');
        }
        
        if (nativeEvent.type === UrbanBotFacebook.type) {
            console.log('this message from facebook');
        }
    });

    // ...
}
```
## useBotContext
The main urban bot context. It works under [`Root`](components.md#root).
```jsx
function SomeComponent() {
    const context = useBotContext();

    // ...
}
```
#### [chat](#chat)
```jsx
function DisplayChatId() {
    const { chat } = useBotContext();

    return <Text>{chat.id}</Text>;
}
```
#### [bot](components.md#bot)
> An instance of specific UrbanBot*.
```jsx
function SomeComponent() {
    const { bot: telegramBot } = useBotContext();

    telegramBot.bot.kickChatMember(/* ... */);

    // ...
}
```
If you develop some messengers you can divide behavior by comparing type.
```jsx
import { UrbanBotTelegram } from '@urban-bot/telegram';
import { UrbanBotSlack } from '@urban-bot/slack';

function SomeComponent() {
    const { bot } = useBotContext();
     
    if (bot.type === UrbanBotTelegram.type) {
        bot.bot.kickChatMember(/* ... */);
    }
    
    if (bot.type === UrbanBotSlack.type) {
        bot.client.conversations.kick(/* ... */);
    }


    // ...
}
```
#### [isNewMessageEveryRender](components.md#isnewmessageeveryrender)
> The value that is passed to the [`Root`](components.md#root).
```jsx
function SomeComponent() {
    const { isNewMessageEveryRender } = useBotContext();

    // ...
}
```
#### [parseMode](components.md#parsemode)
> The value that is passed to the [`Root`](components.md#root).
```jsx
function SomeComponent() {
    const { parseMode } = useBotContext();
    
    // ...
}
```
## useRouter
The router context. It works under [`Router`](components.md#router).
```jsx
function SomeComponent() {
    const routerContext = useRouter();

    // ...
}
```
#### navigate
> Go to the particular route.
```jsx
function ProfileButtons() {
    const { navigate } = useRouter();

    return (
        <ButtonGroup>
            <Button onClick={() => navigate('catalog')}>Go to Catalog</Button>
        </ButtonGroup>
    );
}
```
`Function`
#### activePath
> Current route path.
```jsx
 function WhereAmI() {
     const { activePath } = useRouter();
 
     return <Text>You are here {activePath}</Text>;
 }
 ```
`string` | `RexExp` 
## useAnyEvent
Call after any user action.
```jsx
function SomeComponent() {
    useAnyEvent((event) => {
        console.log('user made something');
    });

    // ...
}
```
#### type
> Event type.
```jsx
function SomeComponent() {
    useAnyEvent(({ type }) => {
        console.log('event type', type);
    });

    // ...
}
```

`'command'` | `'pool'` | `'sticker'` | `'animation'` | `'audio'` | `'contact'` | `'file'` | `'invoice'` | `'location'` | `'image'` | `'poll'` | `'dice'` | `'voice'` | `'action'` | `'video'`

#### payload
> Payload depending on the event type.
```jsx
function SomeComponent() {
    useAnyEvent(({ type, payload }) => {
        if (type === 'text') {
            console.log(payload.text);
        }

        if (type === 'location') {
            console.log(payload.latitude);
        }
    });

    // ...
}
```
#### [chat](#chat)
#### [from](#from)
#### [nativeEvent](#nativeevent)

## useText
Call after user send a text.
```jsx
function SomeComponent() {
    useText((event) => {
        console.log('user sent a text');
    });

    // ...
}
```
#### text
```jsx
function SomeComponent() {
    useText(({ text }) => {
        console.log('user sent a text', text);
    });

    // ...
}
```
`string`
#### [chat](#chat)
#### [from](#from)
#### [nativeEvent](#nativeevent)
