import React from 'react';
import { useBotContext, useMessage } from '../hooks';
import { RouterContext } from '../context';

export function Router({ children }) {
    const [activePath, setActivePath] = React.useState();
    const { userId } = useBotContext();

    useMessage(({ text }) => {
        if (text[0] === '/') {
            setActivePath(text);
        }
    });

    React.useEffect(() => {
        console.log(userId, 'Router start');

        return () => {
            console.log(userId, 'Router leave');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const child = (Array.isArray(children) ? children : [children]).find((child) => {
        return child.props.path === activePath;
    });

    return <RouterContext.Provider value={{ activePath, setActivePath }}>{child}</RouterContext.Provider>;
}

export function Route({ children }) {
    return <>{children}</>;
}
