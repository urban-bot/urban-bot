import type { ReactNode } from 'react';

export type RouterPath = string | Array<string> | RegExp;

export type RouteProps = {
    path: RouterPath;
    description?: string;
    children: ReactNode;
};

export type RouterProps = {
    children: ReactNode;
    withInitializeCommands?: boolean;
    historyLength?: number;
};
