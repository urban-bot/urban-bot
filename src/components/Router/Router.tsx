import React from 'react';
import { useBotContext, useCommand } from '../../hooks/hooks';
import { RouterContext } from '../../context';
import { RouteProps } from './Route';
import { matchChild } from './utils';
import { UrbanCommand } from '../../types';

let isCommandsInitialized = false;

type RouterProps = {
    children: React.ReactElement<RouteProps> | React.ReactElement<RouteProps>[];
    withInitializeCommands?: boolean;
};

export function Router({ children, withInitializeCommands = false }: RouterProps) {
    const { bot } = useBotContext();
    const [activePath, navigate] = React.useState('');
    const childrenArray = React.Children.toArray(children) as React.ReactElement<RouteProps>[];

    React.useEffect(() => {
        if (!withInitializeCommands || isCommandsInitialized) {
            return;
        }

        const commands = childrenArray
            .map((routes) => {
                return {
                    command: routes.props.path,
                    description: routes.props.description,
                };
            })
            .filter(({ command }) => typeof command === 'string' && command[0] === '/') as UrbanCommand[];

        bot.initializeCommands?.(commands).then(() => {
            isCommandsInitialized = true;
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
