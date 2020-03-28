import React from 'react';
import TelegramBot from 'node-telegram-bot-api';
import { createNode } from './dom';
import { reactReconciler } from './reconciler';
import { Root } from './components';

export let bot;

export function render(reactElement, token, callback) {
    const options = {
        polling: true,
    };
    bot = new TelegramBot(token, options);

    const node = createNode('root');

    return reactReconciler.updateContainer(
        reactElement,
        reactReconciler.createContainer(node, false, false),
        null,
        callback,
    );
}
