import React from 'react';
import { useBotContext, useCommand } from '../../hooks/hooks';
import { RouterContext } from '../../context';
import { RouteProps } from './Route';
import { matchChild } from './utils';
import { UrbanCommand } from '../../types';

let isCommandsInitialized = false;

type RouterChild = React.ReactElement<RouteProps> | null | undefined;
type RouterProps = {
    children: RouterChild | RouterChild[];
    withInitializeCommands?: boolean;
};

export function Router({ children, withInitializeCommands = false }: RouterProps) {
    const { bot } = useBotContext();
    const [activePath, navigate] = React.useState('');
    const notNullableChildren = React.Children.toArray(children).filter(
        (route): route is React.ReactElement<RouteProps> => route !== null,
    );

    React.useEffect(() => {
        if (!withInitializeCommands || isCommandsInitialized) {
            return;
        }

        const commands = notNullableChildren
            .map((route) => {
                return {
                    command: route.props.path,
                    description: route.props.description,
                };
            })
            .filter(({ command }) => typeof command === 'string' && command[0] === '/') as UrbanCommand[];

        bot.initializeCommands?.(commands).then(() => {
            isCommandsInitialized = true;
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useCommand(({ command }) => {
        if (notNullableChildren.some(matchChild(command))) {
            navigate(command);
        }
    });

    return (
        <RouterContext.Provider value={{ activePath, navigate }}>
            {notNullableChildren.find(matchChild(activePath))}
        </RouterContext.Provider>
    );
}
