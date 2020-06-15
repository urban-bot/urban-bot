import React from 'react';
import { RouteProps } from './Route';

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
    return matchPattern(path, child.props.path);
};
