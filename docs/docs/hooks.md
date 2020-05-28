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
 * [useBotContext](#usebotcontext)
 
## useBotContext
The main urban bot context.
```jsx
function SomeComponent() {
    useBotContext((context) => {
        // do stuff with context
    });

    // ...
}
```
### Context
#### chat
