import React from 'react';
import { RouteProps } from './Route';
import { Path } from 'path-parser';

// TODO get from common utils
export const matchPattern = (path: string, pattern: string | RegExp, commandPrefix: string) => {
    if (!pattern) {
        return true;
    }

    if (pattern instanceof RegExp) {
        return pattern.test(path);
    }

    if (pattern.includes(' ') || !pattern.startsWith(commandPrefix)) {
        return pattern === path;
    }

    const pathInstance = new Path(pattern);

    return pathInstance.test(path) !== null;
};

export const matchChild = (path: string, commandPrefix: string) => (child: React.ReactElement<RouteProps>) => {
    return matchPattern(path, child.props.path, commandPrefix);
};

export function getParams(path: string, commandPrefix: string, pattern?: string | RegExp) {
    if (typeof pattern !== 'string') {
        return undefined;
    }

    if (pattern.includes(' ') || !pattern.startsWith(commandPrefix)) {
        return undefined;
    }

    const pathInstance = new Path(pattern);

    return pathInstance.test(path) ?? undefined;
}
