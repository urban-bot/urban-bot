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
    useBotContext((context) => {
        // do stuff with context
    });

    // ...
}
```
### Context
#### [`isNewMessageEveryRender`](components.md#isnewmessageeveryrender)
> The value that is passed to the [`Root`](components.md#root).
```jsx
function SomeComponent() {
    useBotContext(({ isNewMessageEveryRender }) => {
        // do stuff with isNewMessageEveryRender
    });

    // ...
}
```
#### [chat](#chat)
```jsx
function SomeComponent() {
    useBotContext(({ chat }) => {
        // do stuff with chat
    });

    // ...
}
```
