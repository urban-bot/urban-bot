import React from 'react';
import { createNode } from './dom';
import { reactReconciler } from './reconciler';

export function render(reactElement, token, callback) {
    const node = createNode('root');

    return reactReconciler.updateContainer(
        reactElement,
        reactReconciler.createContainer(node, false, false),
        null,
        callback,
    );
}
