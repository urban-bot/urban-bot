import React, { createContext, useContext } from 'react';
import { useCount } from './useCount';

const GlobalCountContext = createContext({});

export function GlobalCountProvider({ children }) {
    const { count, raiseCount } = useCount();

    return <GlobalCountContext.Provider value={{ count, raiseCount }}>{children}</GlobalCountContext.Provider>;
}

export function useGlobalCount() {
    return useContext(GlobalCountContext);
}
