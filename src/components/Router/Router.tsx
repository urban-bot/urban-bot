import React from 'react';
import { useCommand } from '../../hooks/hooks';
import { RouterContext } from '../../context';
import { RouteProps } from './Route';
import { matchChild } from './utils';

type RouterProps = {
    children: React.ReactElement<RouteProps> | React.ReactElement<RouteProps>[];
};

// TODO: add another hooks instead of useCommand
// TODO
export function Router(props: RouterProps) {
    const [activePath, navigate] = React.useState('');
    const childrenArray = React.Children.toArray(props.children) as React.ReactElement<RouteProps>[];

    useCommand(({ command }) => {
        if (childrenArray.some(matchChild(command))) {
            navigate(command);
        }
    });

    return (
        <RouterContext.Provider value={{ activePath, navigate }}>
            {childrenArray.find(matchChild(activePath))}
        </RouterContext.Provider>
    );
}
