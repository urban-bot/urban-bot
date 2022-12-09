import ReactReconciler from 'react-reconciler';
import { DefaultEventPriority } from 'react-reconciler/constants';
import { createNode, appendChildNode, removeChildNode, updateNode, insertBeforeNode } from './node';

const rootHostContext = {};
const childHostContext = {};

const hostConfig = {
    // schedulePassiveEffects,
    // cancelPassiveEffects,
    now: Date.now,
    getRootHostContext: () => {
        return rootHostContext;
    },
    prepareForCommit: () => ({}),
    resetAfterCommit: () => {},
    getChildHostContext: () => {
        return childHostContext;
    },
    shouldSetTextContent: (_type: unknown, _props: unknown) => {
        return false;
        // return typeof props.children === 'string' || typeof props.children === 'number';
    },
    createInstance: createNode,
    createTextInstance: () => {},
    resetTextContent: (_node: unknown) => {},
    getPublicInstance: (instance: unknown) => instance,
    appendInitialChild: appendChildNode,
    appendChild: appendChildNode,
    insertBefore: insertBeforeNode,
    finalizeInitialChildren: () => false,
    supportsMutation: true,
    appendChildToContainer: appendChildNode,
    insertInContainerBefore: insertBeforeNode,
    removeChildFromContainer: removeChildNode,
    prepareUpdate: () => true,
    commitUpdate: updateNode,
    commitTextUpdate: (_node: unknown, _oldText: unknown, _newText: unknown) => {},
    removeChild: removeChildNode,
    shouldDeprioritizeSubtree: () => false,
    scheduleDeferredCallback: () => {},
    cancelDeferredCallback: () => {},
    setTimeout: () => {},
    clearTimeout: () => {},
    noTimeout: () => {},
    isPrimaryRenderer: false,
    supportsPersistence: false,
    supportsHydration: false,
    preparePortalMount: () => {},
    scheduleTimeout: () => {},
    cancelTimeout: () => {},
    getCurrentEventPriority: () => {
        return DefaultEventPriority;
    },
    getInstanceFromNode: () => {
        return undefined;
    },
    beforeActiveInstanceBlur: () => {},
    afterActiveInstanceBlur: () => {},
    prepareScopeUpdate: () => {},
    getInstanceFromScope: () => {},
    detachDeletedInstance: () => {},
    clearContainer: () => {},
};

export const reactReconciler = ReactReconciler(hostConfig);
