import ReactReconciler from 'react-reconciler';
import { createNode, appendChildNode, removeChildNode, updateNode } from './dom';

const rootHostContext = {};
const childHostContext = {};

const hostConfig = {
    // schedulePassiveEffects,
    // cancelPassiveEffects,
    now: Date.now,
    getRootHostContext: () => {
        return rootHostContext;
    },
    prepareForCommit: () => {},
    resetAfterCommit: () => {},
    getChildHostContext: () => {
        return childHostContext;
    },
    // eslint-disable-next-line no-unused-vars
    shouldSetTextContent: (type, props) => {
        return false;
        // return typeof props.children === 'string' || typeof props.children === 'number';
    },
    createInstance: (type, newProps) => {
        return createNode(type, newProps);
    },
    createTextInstance: () => {},
    // eslint-disable-next-line no-unused-vars
    resetTextContent: (node) => {},
    getPublicInstance: (instance) => instance,
    appendInitialChild: appendChildNode,
    appendChild: appendChildNode,
    insertBefore: appendChildNode,
    finalizeInitialChildren: () => {},
    supportsMutation: true,
    appendChildToContainer: appendChildNode,
    insertInContainerBefore: appendChildNode,
    removeChildFromContainer: removeChildNode,
    prepareUpdate: () => true,
    commitUpdate: updateNode,
    // eslint-disable-next-line no-unused-vars
    commitTextUpdate: (node, oldText, newText) => {},
    removeChild: removeChildNode,
};

export const reactReconciler = ReactReconciler(hostConfig);
