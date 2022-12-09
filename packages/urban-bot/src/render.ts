import React from 'react';
import { createNode } from './node';
import { reactReconciler } from './reconciler';

export function render(reactElement: React.ReactElement, callback: () => void | null | undefined = () => null) {
    const node = createNode('root');

    return reactReconciler.updateContainer(
        reactElement,
        reactReconciler.createContainer(node, 0, null, false, null, '', () => {}, null),
        null,
        callback,
    );
}
