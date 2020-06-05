[![npm package](https://img.shields.io/npm/v/@urban-bot/core?logo=npm&style=flat-square)](https://www.npmjs.com/package/@urban-bot/core)
![Build](https://github.com/urban-bot/urban-bot/workflows/Node.js%20CI/badge.svg)
# Urban Bot

The universal chatbot library based on [React](https://github.com/facebook/react).

* **Declarative.** You don't need to know any messenger API, just write simple react components.
* **Multiplatform.** Write once, launch any messenger.
* **Reusable.** Easy share logic between different chatbots or just use common parts.
* **Session.** App renders unique for every chat, so just write your app as if it is client-side rendering.
* **Types.** Full typescript support.

**Platforms we are supporting**

[![](files/telegram-logo.svg)](https://telegram.org/)
 [![](files/slack-logo.svg)](https://slack.com/)
 [![](files/facebook-logo.svg)](https://www.messenger.com/)
 
 
**Soon**

[![](files/discord-logo.svg)](https://www.discord.com/)
 [![](files/whatsapp-logo.svg)](https://www.whatsapp.com/)
 [![](files/vk-logo.svg)](https://www.vk.com/)
 [![](files/viber-logo.svg)](https://www.viber.com/)

## [Documentation](https://urban-bot.now.sh/docs/components.html)

## Installation
Please use our zero configuration [starter](https://github.com/urban-bot/urban-bot-starter-typescript).
#### typescript
`npx create-urban-bot my-app`
#### javascript
`npx create-urban-bot my-app --template js`

Or install manually:
```bash
npm i react @urban-bot/core @urban-bot/telegram @urban-bot/facebook ...
```

## Example
### Hello, World!
```javascript
import React from 'react';
import { render, Root, Text } from '@urban-bot/core';
import { UrbanBotTelegram } from '@urban-bot/telegram';

const bot = new UrbanBotTelegram({
    token: 'telegramToken',
    isPolling: true,
});

render(
    <Root bot={bot}>
        <Text>Hello, world!</Text>
    </Root>
);
```

### With Router
![](files/telegram-gif.gif)
![](files/slack-gif.gif)
```javascript
import React from 'react';
import { render, Route, Router, Root, Text, ButtonGroup, Button, useText } from '@urban-bot/core';
import { UrbanBotTelegram } from '@urban-bot/telegram';
import { UrbanBotSlack } from '@urban-bot/slack';

function Echo() {
    const [text, setText] = React.useState('Say something');

    useText(({ text }) => {
        setText(text);
    });

    return (
        <Text>
            <i>{text}</i>
        </Text>
    );
}

function Counter() {
    const [count, setCount] = React.useState(0);

    const increment = () => setCount(count + 1);
    const decrement = () => setCount(count - 1);

    return (
        <ButtonGroup title={count} isNewMessageEveryRender={false}>
            <Button onClick={increment}>+1</Button>
            <Button onClick={decrement}>-1</Button>
        </ButtonGroup>
    );
}

function App() {
    return (
        <Router>
            <Route path="/echo">
                <Echo />
            </Route>
            <Route path="/counter">
                <Counter />
            </Route>
        </Router>
    );
}

const urbanBotTelegram = new UrbanBotTelegram({
    token: 'telegramToken',
    isPolling: true,
});

const urbanBotSlack = new UrbanBotSlack({
    signingSecret: 'slackSigningSecret',
    token: 'slackToken',
});

render(
    <Root bot={urbanBotTelegram}>
        <App />
    </Root>
);

render(
    <Root bot={urbanBotSlack}>
        <App />
    </Root>
);
```
