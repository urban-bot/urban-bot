import React from 'react';
import { useCommand } from '../../hooks/hooks';
import { RouterContext } from '../../context';
import { Route, RouteProps } from './Route';
import { matchRoute } from './matchRoute';

type RouterProps = {
    children: React.ReactElement<RouteProps> | React.ReactElement<RouteProps>[];
};

export function Router(props: RouterProps) {
    const [activePath, navigate] = React.useState('');

    useCommand(({ command }) => {
        // TODO navigate only if this path exist
        navigate(command);
    });

    const childrenArray = React.Children.toArray(props.children) as React.ReactElement<RouteProps>[];
    const child = childrenArray.filter((child) => {
        if (child.type !== Route) {
            throw new Error('Pass only Route component to Router');
        }

        return matchRoute(activePath, { path: child.props.path, regex: child.props.regex });
    });

    return <RouterContext.Provider value={{ activePath, navigate }}>{child}</RouterContext.Provider>;
}
