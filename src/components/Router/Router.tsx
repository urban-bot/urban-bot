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
    const childrenArray = React.Children.toArray(props.children) as React.ReactElement<RouteProps>[];

    const matchChild = (child: React.ReactElement<RouteProps>) => {
        if (child.type !== Route) {
            throw new Error('Pass only Route component to Router');
        }
        return matchRoute(activePath, { pattern: child.props.path });
    };

    useCommand(({ command }) => {
        if (childrenArray.some(matchChild)) {
            navigate(command);
        }
    });

    return (
        <RouterContext.Provider value={{ activePath, navigate }}>
            {childrenArray.find(matchChild)}
        </RouterContext.Provider>
    );
}
