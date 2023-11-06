import React from 'react';
import { Router, Route, Text, useRouter, ButtonGroup, Button } from '@urban-bot/core';

function Buttons() {
    const { navigate, history } = useRouter();

    return (
        <ButtonGroup title="Route 1" maxColumns={1}>
            <Button onClick={() => navigate('/route_2')}>Go to Route 2</Button>
            <Button onClick={() => navigate('/params/123')}>Go to Route wih params</Button>
            <Button onClick={() => navigate('/query', { userId: 123 })}>Go to Route wih query</Button>
            <Button onClick={() => navigate(history[history.length - 2])}>Go back</Button>
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

function Params() {
    const { params } = useRouter<{ id: string }>();

    return <Text>Route id is {params?.id}</Text>;
}

function Query() {
    const { query } = useRouter<{}, { userId: number }>();

    return <Text>Route id is {query.userId}</Text>;
}

function ArrayRoute() {
    const { navigate, history } = useRouter();

    return (
        <ButtonGroup title="Array Route" maxColumns={1}>
            <Button onClick={() => navigate(history[history.length - 2])}>Go back</Button>
        </ButtonGroup>
    );
}

export function RouterExample() {
    const title = 'Welcome to Router! Click or write some of:';

    return (
        <Router>
            <Route path="/" description="default path">
                <ButtonGroup isReplyButtons title={title} maxColumns={1}>
                    <Button>route_1</Button>
                    <Button>/route_2</Button>
                    <Button>/params/123</Button>
                    <Button>/array_1</Button>
                    <Button>array_2</Button>
                </ButtonGroup>
            </Route>
            <Route path="/route_1" description="path by string">
                <Buttons />
            </Route>
            <Route path="route_2" description="path by command">
                <ReplyButtons />
            </Route>
            <Route path="/params/:id" description="params">
                <Params />
            </Route>
            <Route path="/query" description="query">
                <Query />
            </Route>
            <Route path={['/array_1', 'array_2']} description="path list">
                <ArrayRoute />
            </Route>
            <Route path={/.+/} description="path by regex">
                <Text>Not found</Text>
            </Route>
        </Router>
    );
}
