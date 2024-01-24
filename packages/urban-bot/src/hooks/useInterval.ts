import { useEffect, useRef } from 'react';

export function useInterval(callback: Function, interval = 0) {
    const savedCallback = useRef<Function>();

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        const id = setInterval(() => {
            savedCallback.current?.();
        }, interval);

        return () => clearInterval(id);
    }, [interval]);
}
