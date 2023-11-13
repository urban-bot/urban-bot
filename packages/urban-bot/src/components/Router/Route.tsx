import React from 'react';
import { RouterPath } from './types';

export type RouteProps = {
    path: RouterPath;
    description?: string;
    children: React.ReactNode;
};

export function Route(props: RouteProps) {
    return <>{props.children}</>;
}
