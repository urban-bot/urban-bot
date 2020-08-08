import React from 'react';
import { RouteProps } from './Route';
import { Path } from 'path-parser';

// TODO get from common utils
export const matchPattern = (path: string, pattern: string | RegExp) => {
    if (!pattern) {
        return true;
    }

    if (pattern instanceof RegExp) {
        return pattern.test(path);
    }

    const pathInstance = new Path(pattern);

    return pathInstance.test(path) !== null;
};

export const matchChild = (path: string) => (child: React.ReactElement<RouteProps>) => {
    return matchPattern(path, child.props.path);
};

export function getParams(path: string, pattern?: string | RegExp) {
    if (typeof pattern !== 'string') {
        return undefined;
    }

    const pathInstance = new Path(pattern);

    return pathInstance.test(path) ?? undefined;
}
