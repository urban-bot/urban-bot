import React from 'react';

export type RouteProps = {
    path: string;
    regex?: boolean;
    children: React.ReactNode;
};

export function Route(props: RouteProps) {
    return <>{props.children}</>;
}
