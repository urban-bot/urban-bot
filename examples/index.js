import dotenv from 'dotenv';
import React from 'react';
import { render, Route, Image, Text, useInput, Button, ButtonGroup, Router, useBotContext } from '../src';

dotenv.config();
const isDevelopment = process.env.NODE_ENV === 'development';

const token = isDevelopment ? process.env.TELEGRAM_TOKEN_DEV : process.env.TELEGRAM_TOKEN;

function Main() {
    const { setActivePath } = useBotContext();
    const [title, setTitle] = React.useState(0);

    return (
        <>
            {/*<Image*/}
            {/*    src="https://www.cheatsheet.com/wp-content/uploads/2018/06/jennifer-aniston-leprechaun-640x488.jpg"*/}
            {/*    caption={name}*/}
            {/*    // inlineButtons={*/}
            {/*    //     <ButtonGroup title="buttons">*/}
            {/*    //         <Button onClick={() => console.log(1)}>1</Button>*/}
            {/*    //         <Button onClick={() => console.log(2)}>2</Button>*/}
            {/*    //     </ButtonGroup>*/}
            {/*    // }*/}
            {/*/>*/}
            <ButtonGroup title={title}>
                <Button onClick={() => setTitle(title + 1)}>Change title</Button>
                <Button onClick={() => setActivePath('/help')}>Go to help</Button>
            </ButtonGroup>
        </>
    );
}

function Help() {
    const { setActivePath } = useBotContext();

    return (
        <>
            <ButtonGroup title="Help">
                <Button onClick={() => setActivePath('/start')}>Go back</Button>
            </ButtonGroup>
        </>
    );
}

function App() {
    return (
        <Router>
            <Route path="/start">
                <Main />
            </Route>
            <Route path="/help">
                <Help />
            </Route>
        </Router>
    );
}

if (isDevelopment) {
    render(<App />, token);
} else {
    bot.startWebhook('/', null, 3000);
}
