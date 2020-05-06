import React from 'react';
import { Route, RouteProps } from './Route';

export const matchRoute = (path: string, pattern: string | RegExp) => {
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
    return matchRoute(path, child.props.path);
};
