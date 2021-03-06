import React from 'react';

export function useInterval(callback: Function, interval = 0) {
    const savedCallback = React.useRef<Function>();

    React.useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    React.useEffect(() => {
        const id = setInterval(() => {
            savedCallback.current?.();
        }, interval);

        return () => clearInterval(id);
    }, [interval]);
}
