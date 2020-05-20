import React from 'react';
import { Router, Route, Text, useRouter, ButtonGroup, Button } from '@urban-bot/core';

function Buttons() {
    const { navigate } = useRouter();

    return (
        <ButtonGroup title="Route 1">
            <Button onClick={() => navigate('/route_2')}>Go to Route 2</Button>
        </ButtonGroup>
    );
}

function ReplyButtons() {
    return (
        <ButtonGroup isReplyButtons title="Route 2">
            <Button>route_1</Button>
        </ButtonGroup>
    );
}

export function RouterExample() {
    return (
        <Router>
            <Route path="/" description="default path">
                <Text>Welcome to Router! Write route_1 or /route_2</Text>
            </Route>
            <Route path="route_1" description="path by string">
                <Buttons />
            </Route>
            <Route path="/route_2" description="path by command">
                <ReplyButtons />
            </Route>
            <Route path={/.+/} description="path by regex">
                <Text>Not found</Text>
            </Route>
        </Router>
    );
}
