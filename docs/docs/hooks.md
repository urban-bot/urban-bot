---
id: hooks
title: Hooks 
sidebar_label: Hooks
---
**React hooks from the Urban Bot. Use it to subscrube to user actions or get an application data.**

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
 
## Common
#### chat
> Information about the chat.
```
id: string;
type?: string;
title?: string;
username?: string;
firstName?: string;
lastName?: string;
description?: string;
inviteLink?: string;
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
> Go to some route.
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
#### activePath
> Current route path.
```jsx
 function WhereAmI() {
     const { activePath } = useRouter();
 
     return <Text>You are here {activePath}</Text>;
 }
 ```
