import React from 'react';
import { Route, RouteProps } from './Route';

export const matchPattern = (path: string, pattern: string | RegExp) => {
    if (!pattern) {
        return true;
    }

    if (pattern instanceof RegExp) {
        return pattern.test(path);
    }

    return pattern === path;
};

export const matchChild = (path: string) => (child: React.ReactElement<RouteProps>) => {
    if (child.type !== Route) {
        throw new Error('Pass only Route component to Router');
    }
    return matchPattern(path, child.props.path);
};
