import React from 'react';
import { useBotContext, useCommand } from '../hooks';
import { RouterContext } from '../context';

export function Router({ children }) {
    const [activePath, navigate] = React.useState();
    const { chat } = useBotContext();

    useCommand(({ text }) => {
        navigate(text);
    });

    React.useEffect(() => {
        console.log(chat.id, 'Router start');

        return () => {
            console.log(chat.id, 'Router leave');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const child = (Array.isArray(children) ? children : [children]).find((child) => {
        return child.props.path === activePath;
    });

    return <RouterContext.Provider value={{ activePath, navigate }}>{child}</RouterContext.Provider>;
}

export function Route({ children }) {
    return <>{children}</>;
}
