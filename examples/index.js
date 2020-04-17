import dotenv from 'dotenv';
import React from 'react';
import {
    render,
    Route,
    Image,
    useText,
    Button,
    ButtonGroup,
    Router,
    useRouter,
    Root,
    Text,
    useBotContext,
} from '../src';
import { TelegramBot } from '../src/TelegramBot/TelegramBot';
import { SlackBot } from '../src/SlackBot/SlackBot';
import { TextExample } from './Text';
import { HooksExample } from './hooks';

dotenv.config();

const token = process.env.TELEGRAM_TOKEN_DEV;

function Main() {
    const { bot } = useBotContext();
    const { navigate } = useRouter();
    const [title, setTitle] = React.useState('0');
    const [src, setSrc] = React.useState(true);

    useText(({ text }) => {
        setTitle(text);
    });

    return (
        <Image
            src={
                src
                    ? 'https://www.cheatsheet.com/wp-content/uploads/2018/06/jennifer-aniston-leprechaun-640x488.jpg'
                    : 'https://cs10.pikabu.ru/post_img/2019/02/12/5/154995561311747403.jpg'
            }
            title={bot.type !== SlackBot.TYPE ? <b>{title}</b> : title}
            altText="girls "
            buttons={
                <ButtonGroup>
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
                    <Button onClick={() => navigate('/text')}>Go to text</Button>
                </ButtonGroup>
            }
        />
    );
}

export function ArrayComponent() {
    const [array, setArray] = React.useState(['0', '1', '2']);
    const index = React.useRef(array.length);

    const texts = array.map((v) => {
        return <Text key={v}>{v}</Text>;
    });

    return (
        <>
            <ButtonGroup title={<b>array</b>}>
                <Button onClick={() => setArray([...array, index.current++])}>Push</Button>
                <Button
                    onClick={() => {
                        const [_first, ...newArray] = array;
                        setArray(newArray);
                    }}
                >
                    Delete first
                </Button>
            </ButtonGroup>
            {texts}
        </>
    );
}

function App() {
    return (
        <Router>
            <Route path="/start">
                <Main />
            </Route>
            <Route path="/text">
                <TextExample />
            </Route>
            <Route path="/array">
                <ArrayComponent />
            </Route>
            <Route path="/hooks">
                <HooksExample />
            </Route>
        </Router>
    );
}

render(
    <Root
        bot={
            new TelegramBot(token, {
                polling: true,
            })
        }
        parseMode="HTML"
    >
        <App />
    </Root>,
);

render(
    <Root
        bot={
            new SlackBot({
                signingSecret: process.env.SLACK_SIGNING_SECRET,
                token: process.env.SLACK_TOKEN,
            })
        }
    >
        <App />
    </Root>,
);
