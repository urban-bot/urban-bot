import React, { useRef, useCallback } from 'react';
import { useBotContext } from '../../hooks/hooks';
import { useText } from '../../hooks/useText';
import { useCommand } from '../../hooks/useCommand';
import { RouterContext } from '../../context';
import { RouteProps } from './Route';
import { getParams, matchChild } from './utils';
import { UrbanCommand } from '../../types';

let isCommandsInitialized = false;

type RouterProps = {
    children: React.ReactNode;
    withInitializeCommands?: boolean;
    historyLength?: number;
};

export function Router({ children, withInitializeCommands = false, historyLength = 5 }: RouterProps) {
    const { bot } = useBotContext();
    const history = useRef<string[]>([]);
    const [activePath, setActivePath] = React.useState(() => ({ value: '', key: Math.random() }));
    const childrenArray = React.Children.toArray(children) as React.ReactElement<RouteProps>[];

    const navigate = useCallback(
        (path: string) => {
            const newHistory = [...history.current, path];

            history.current = newHistory.length <= historyLength ? newHistory : newHistory.slice(1);

            setActivePath({ value: path, key: Math.random() });
        },
        [historyLength],
    );

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
            .filter(
                ({ command, description }) =>
                    typeof command === 'string' && command[0] === bot.commandPrefix && Boolean(description),
            ) as UrbanCommand[];

        bot.initializeCommands?.(commands).then(() => {
            isCommandsInitialized = true;
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        if (childrenArray.some(matchChild(bot.commandPrefix, bot.commandPrefix))) {
            navigate(bot.commandPrefix);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // TODO check router children rerendering

    useCommand(({ command }) => {
        if (childrenArray.some(matchChild(command, bot.commandPrefix))) {
            navigate(command);
        }
    });

    useText(({ text }) => {
        if (childrenArray.some(matchChild(text, bot.commandPrefix))) {
            navigate(text);
        }
    });

    const component = childrenArray.find(matchChild(activePath.value, bot.commandPrefix));
    const params = getParams(activePath.value, bot.commandPrefix, component?.props.path);

    return (
        <RouterContext.Provider value={{ activePath: activePath.value, navigate, params, history: history.current }}>
            {component ? <component.type {...component.props} key={activePath.key} /> : null}
        </RouterContext.Provider>
    );
}
