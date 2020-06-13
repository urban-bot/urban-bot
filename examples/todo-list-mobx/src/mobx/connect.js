import { createContext, useContext } from 'react';

const StoreContext = createContext({});

export const Provider = StoreContext.Provider;
export const useStore = () => useContext(StoreContext);
