/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');

const MarkdownBlock = CompLibrary.MarkdownBlock; /* Used to read markdown */
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

const example = `
\`\`\`jsx
import React from 'react';
import { render, Route, Router, Root, Text, ButtonGroup, Button, useText } from '@urban-bot/core';
import { UrbanBotTelegram } from '@urban-bot/telegram';

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

const bot = new UrbanBotTelegram({
    token: 'telegramToken',
    isPolling: true,
});

render(
    <Root bot={bot}>
        <App />
    </Root>
);
`;

class HomeSplash extends React.Component {
    render() {
        const { siteConfig, language = '' } = this.props;
        const { baseUrl, docsUrl } = siteConfig;
        const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
        const langPart = `${language ? `${language}/` : ''}`;
        const docUrl = (doc) => `${baseUrl}${docsPart}${langPart}${doc}`;

        const SplashContainer = (props) => (
            <div className="homeContainer">
                <div className="homeSplashFade">
                    <div className="wrapper homeWrapper">{props.children}</div>
                </div>
            </div>
        );

        const Logo = (props) => (
            <div className="projectLogo">
                <img src={props.img_src} alt="Project Logo" />
            </div>
        );

        const ProjectTitle = (props) => (
            <h2 className="projectTitle">
                {props.title}
                <small>{props.tagline}</small>
            </h2>
        );

        const PromoSection = (props) => (
            <div className="section promoSection">
                <div className="promoRow">
                    <div className="pluginRowBlock">{props.children}</div>
                </div>
            </div>
        );

        const Button = (props) => (
            <div className="pluginWrapper buttonWrapper">
                <a className="button" href={props.href} target={props.target}>
                    {props.children}
                </a>
            </div>
        );

        return (
            <SplashContainer>
                {/*<Logo img_src={`${baseUrl}img/undraw_monitor.svg`} />*/}
                <div className="inner">
                    <ProjectTitle tagline={siteConfig.tagline} title={siteConfig.title} />
                    <PromoSection>
                        <Button href={docUrl('components.html')}>Documentation</Button>
                        <Button target="_blank" href="https://github.com/urban-bot/urban-bot/tree/master/examples">Examples</Button>
                    </PromoSection>
                </div>
            </SplashContainer>
        );
    }
}

class Index extends React.Component {
    render() {
        const { config: siteConfig, language = '' } = this.props;
        const { baseUrl } = siteConfig;

        const Block = (props) => (
            <Container padding={['bottom', 'top']} id={props.id} background={props.background}>
                <GridBlock align="center" contents={props.children} layout={props.layout} />
            </Container>
        );

        const Showcase = () => {
            if ((siteConfig.users || []).length === 0) {
                return null;
            }

            const showcase = siteConfig.users
                .filter((user) => user.pinned)
                .map((user) => (
                    <a href={user.infoLink} key={user.infoLink}>
                        <img src={user.image} alt={user.caption} title={user.caption} />
                    </a>
                ));

            const pageUrl = (page) => baseUrl + (language ? `${language}/` : '') + page;

            return (
                <div className="productShowcaseSection paddingBottom">
                    <h2>Who is Using This?</h2>
                    <p>This project is used by all these people</p>
                    <div className="logos">{showcase}</div>
                    <div className="more-users">
                        <a className="button" href={pageUrl('users.html')}>
                            More {siteConfig.title} Users
                        </a>
                    </div>
                </div>
            );
        };

        return (
            <div>
                <HomeSplash siteConfig={siteConfig} language={language} />
                <div className="platforms">
                    <h3 className="title">Platforms we are supporting</h3>
                    <div className="logos">
                        <a href="https://telegram.org/" className="logo" target="_blank">
                            <img src="https://raw.githubusercontent.com/urban-bot/urban-bot/1a53c6f3107bd4a40d00f17adadcab2838d6b2e2/files/telegram-logo.svg" alt="telegram" />
                        </a>
                        <a href="https://slack.com/" className="logo" target="_blank">
                            <img src="https://raw.githubusercontent.com/urban-bot/urban-bot/1a53c6f3107bd4a40d00f17adadcab2838d6b2e2/files/slack-logo.svg" alt="slack" />
                        </a>
                        <a href="https://www.messenger.com/" className="logo" target="_blank">
                            <img src="https://raw.githubusercontent.com/urban-bot/urban-bot/1a53c6f3107bd4a40d00f17adadcab2838d6b2e2/files/facebook-logo.svg" alt="facebook" />
                        </a>
                    </div>
                    <h3 className="title">Soon</h3>
                    <div className="logos">
                        <a href="https://www.discord.com/" className="logo" target="_blank">
                            <img src="https://raw.githubusercontent.com/urban-bot/urban-bot/1a53c6f3107bd4a40d00f17adadcab2838d6b2e2/files/discord-logo.svg" alt="discord" />
                        </a>
                        <a href="https://www.whatsapp.com/" className="logo" target="_blank">
                            <img src="https://raw.githubusercontent.com/urban-bot/urban-bot/1a53c6f3107bd4a40d00f17adadcab2838d6b2e2/files/whatsapp-logo.svg" alt="whatsapp" />
                        </a>
                        <a href="https://www.vk.com/" className="logo" target="_blank">
                            <img src="https://raw.githubusercontent.com/urban-bot/urban-bot/1a53c6f3107bd4a40d00f17adadcab2838d6b2e2/files/vk-logo.svg" alt="vk" />
                        </a>
                        <a href="https://www.viber.com/" className="logo" target="_blank">
                            <img src="https://raw.githubusercontent.com/urban-bot/urban-bot/1a53c6f3107bd4a40d00f17adadcab2838d6b2e2/files/viber-logo.svg" alt="viber" />
                        </a>
                    </div>
                </div>
                <h3 className="example-title">Example</h3>
                <div className="example">
                    <div>
                        <MarkdownBlock>{example}</MarkdownBlock>
                    </div>
                    <div>
                        <img
                            src="https://raw.githubusercontent.com/urban-bot/urban-bot/master/files/telegram-gif.gif"
                            alt="telegram"
                        />
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = Index;
