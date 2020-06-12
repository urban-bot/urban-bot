import React, { useState } from 'react';
import { Route, Router, Text, useText } from '@urban-bot/core';

function Echo() {
    const [text, setText] = useState('Say something');

    useText(({ text }) => {
        setText(text);
    });

    return (
        <Text>
            <i>{text}</i>
        </Text>
    );
}

export function App() {
    return (
        <>
            <Text>Welcome to Urban Bot! Type /echo</Text>
            <Router>
                <Route path="/echo">
                    <Echo />
                </Route>
            </Router>
        </>
    );
}
