import React from 'react';
import { Route, RouteProps } from './Route';

type PatchOptions = { pattern?: string | RegExp };

export const matchRoute = (pathname: string, options: PatchOptions) => {
    const { pattern } = options;
    if (!pattern) {
        return true;
    }

    if (pattern instanceof RegExp) {
        return pattern.test(pathname);
    }

    return pattern === pathname;
};

export const matchChild = (url: string) => (child: React.ReactElement<RouteProps>) => {
    if (child.type !== Route) {
        throw new Error('Pass only Route component to Router');
    }
    return matchRoute(url, { pattern: child.props.path });
};
