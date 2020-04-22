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
import { UrbanTelegramBot } from '../src/TelegramBot/UrbanTelegramBot';
import { UrbanSlackBot } from '../src/SlackBot/UrbanSlackBot';
import { TextExample } from './Text';
import { HooksExample } from './hooks';

dotenv.config();

function Main() {
    const { bot } = useBotContext();
    const { navigate } = useRouter();
    const [title, setTitle] = React.useState('0');
    const [src, setSrc] = React.useState(true);

    useText(({ payload }) => {
        setTitle(payload.text);
    });

    return (
        <Image
            src={
                src
                    ? 'https://www.cheatsheet.com/wp-content/uploads/2018/06/jennifer-aniston-leprechaun-640x488.jpg'
                    : 'https://cs10.pikabu.ru/post_img/2019/02/12/5/154995561311747403.jpg'
            }
            title={bot.type !== UrbanSlackBot.TYPE ? <b>{title}</b> : title}
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
    const [index, setIndex] = React.useState(array.length);

    const addLast = () => {
        setArray([...array, String(index)]);
        setIndex(index + 1);
    };

    const deleteFirst = () => {
        const [_first, ...newArray] = array;
        setArray(newArray);
    };

    return (
        <>
            <ButtonGroup title={<b>array</b>}>
                <Button onClick={addLast}>Push</Button>
                <Button onClick={deleteFirst}>Delete first</Button>
            </ButtonGroup>
            {array.map((value) => {
                return <Text key={value}>{value}</Text>;
            })}
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

const urbanTelegramBot = new UrbanTelegramBot(process.env.TELEGRAM_TOKEN_DEV as string, {
    polling: true,
});

const urbanSlackBot = new UrbanSlackBot({
    signingSecret: process.env.SLACK_SIGNING_SECRET as string,
    token: process.env.SLACK_TOKEN as string,
});

render(
    <Root bot={urbanTelegramBot} parseMode="HTML">
        <App />
    </Root>,
);

render(
    <Root bot={urbanSlackBot}>
        <App />
    </Root>,
);
