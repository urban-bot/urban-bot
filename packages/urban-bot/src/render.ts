import { createNode } from './node';
import { reactReconciler } from './reconciler';
import type { ReactElement } from 'react';

export function render(reactElement: ReactElement, callback: () => void | null | undefined = () => null) {
    const node = createNode('root');

    return reactReconciler.updateContainer(
        reactElement,
        reactReconciler.createContainer(node, 0, null, false, null, '', () => {}, null),
        null,
        callback,
    );
}
