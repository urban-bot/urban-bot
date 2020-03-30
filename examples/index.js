import dotenv from 'dotenv';
import React from 'react';
import { render, Route, Image, useMessage, Button, ButtonGroup, Router, useRouter, Root, Text } from '../src';

dotenv.config();
const isDevelopment = process.env.NODE_ENV === 'development';

const token = isDevelopment ? process.env.TELEGRAM_TOKEN_DEV : process.env.TELEGRAM_TOKEN;

function Main() {
    const { setActivePath } = useRouter();
    const [title, setTitle] = React.useState('0');
    const [src, setSrc] = React.useState(true);

    useMessage(({ text }) => {
        setTitle(text);
    });

    return (
        // FIXME make right order to send message
        <>
            <Image
                src={
                    src
                        ? 'https://www.cheatsheet.com/wp-content/uploads/2018/06/jennifer-aniston-leprechaun-640x488.jpg'
                        : 'https://cs10.pikabu.ru/post_img/2019/02/12/5/154995561311747403.jpg'
                }
                caption={title}
            />
            <ButtonGroup title={'title'}>
                <Button
                    onClick={() => {
                        setTitle(title + 1);
                    }}
                >
                    Change title
                </Button>
                <Button
                    onClick={() => {
                        setSrc(!src);
                    }}
                >
                    Toggle picture
                </Button>
                <Button onClick={() => setActivePath('/help')}>Go to help</Button>
            </ButtonGroup>
        </>
    );
}

function Help() {
    const { setActivePath } = useRouter();

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
        <Root
            token={token}
            options={{
                polling: true,
            }}
        >
            <Router>
                <Route path="/start">
                    <Main />
                </Route>
                <Route path="/help">
                    <Help />
                </Route>
            </Router>
        </Root>
    );
}

render(<App />);
