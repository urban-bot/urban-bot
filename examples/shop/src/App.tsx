import React from 'react';
import { Button, ButtonGroup, Route, Router } from '@urban-bot/core';
import { Bucket } from './pages/Bucket';
import { Provider, store } from './store/connect';
import { Catalog } from './pages/Products';

export function App() {
    return (
        <Provider value={store}>
            <ButtonGroup title={"Welcome to Shop! Type 'bucket' or 'catalog'."} isReplyButtons>
                <Button>bucket</Button>
                <Button>catalog</Button>
            </ButtonGroup>
            <Router>
                <Route path="bucket">
                    <Bucket />
                </Route>
                <Route path="catalog">
                    <Catalog />
                </Route>
            </Router>
        </Provider>
    );
}
