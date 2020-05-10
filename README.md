[![npm package](https://img.shields.io/npm/v/urban-bot?logo=npm&style=flat-square)](https://www.npmjs.org/package/urban-bot)
![Build](https://github.com/urban-bot/urban-bot/workflows/Node.js%20CI/badge.svg)
# Urban Bot

Universal chatbot library based on React.

* **Declarative.** You don't need to know any messenger API, just write simple react components.
* **Multiplatform.** Write once, launch any messenger.
* **Reusable.** Easy share logic between different chatbots or just use common parts.
* **Session.** All components are unique for every user, so just write an app as if it is client-side rendering.
* **Types.** Full typescript support.

## Installation
```
$ npm i urban-bot react urban-bot-(slack|telegram|...)
```

## Simple example
![](files/telegram-gif.gif)
![](files/slack-gif.gif)
```javascript
import React from 'react';
import { render, Route, Router, Root, Text, ButtonGroup, Button, useText } from 'urban-bot';
import { UrbanBotTelegram } from 'urban-bot-telegram';
import { UrbanBotSlack } from 'urban-bot-slack';

function Echo() {
    const [text, setText] = React.useState('Say something');

    useText(({ text }) => {
        setText(text);
    });

    return (
        <Text isNewMessageEveryRender>
            <i>{text}</i>
        </Text>
    );
}

function Counter() {
    const [count, setCount] = React.useState(0);

    const increment = () => setCount(count + 1);
    const decrement = () => setCount(count - 1);

    return (
        <ButtonGroup title={count}>
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

render(
    <Root
        bot={
            new UrbanBotTelegram(telegramToken, {
                polling: true,
            })
        }
    >
        <App />
    </Root>
);

render(
    <Root
        bot={
            new UrbanBotSlack({
                signingSecret: slackSigningSecret,
                token: slackToken,
            })
        }
    >
        <App />
    </Root>
);
```
