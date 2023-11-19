import { Path } from 'path-parser';
import type { ReactElement } from 'react';
import type { RouteProps, RouterPath } from './types';

const checkPath = (path: string) => (routePath: string) => {
    const pathInstance = new Path(routePath);

    return pathInstance.test(path) !== null;
};

// TODO get from common utils
export const matchPattern = (path: string, pattern: RouterPath, commandPrefix: string) => {
    if (!pattern) {
        return true;
    }

    if (pattern instanceof RegExp) {
        return pattern.test(path);
    }

    if (Array.isArray(pattern)) {
        return pattern.some(checkPath(path));
    }

    if (pattern.includes(' ') || !pattern.startsWith(commandPrefix)) {
        return pattern === path;
    }

    return checkPath(path)(pattern);
};

export const matchChild = (path: string, commandPrefix: string) => (child: ReactElement<RouteProps>) => {
    return matchPattern(path, child.props.path, commandPrefix);
};

export function getParams(path: string, commandPrefix: string, pattern?: RouterPath) {
    if (typeof pattern !== 'string') {
        return undefined;
    }

    if (pattern.includes(' ') || !pattern.startsWith(commandPrefix)) {
        return undefined;
    }

    const pathInstance = new Path(pattern);

    return pathInstance.test(path) ?? undefined;
}
