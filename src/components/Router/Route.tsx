import React from 'react';

export type RouteProps = {
    path: string | RegExp;
    children: React.ReactNode;
};

export function Route(props: RouteProps) {
    return <>{props.children}</>;
}
