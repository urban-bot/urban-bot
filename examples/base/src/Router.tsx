import React from 'react';
import { Router, Route, Text, useRouter, ButtonGroup, Button } from '@urban-bot/core';

function Route1() {
    const { navigate } = useRouter();

    return (
        <ButtonGroup title="Route 1">
            <Button onClick={() => navigate('/route_2')}>Go to Route 2</Button>
        </ButtonGroup>
    );
}

function Route2() {
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
                <Route1 />
            </Route>
            <Route path="/route_2" description="path by command">
                <Route2 />
            </Route>
            <Route path={/.+/} description="path by regex">
                <Text>Not found</Text>
            </Route>
        </Router>
    );
}
