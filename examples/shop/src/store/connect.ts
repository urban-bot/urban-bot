import { createContext, useContext } from 'react';
import products from './products.json';

type Product = {
    name: string;
    images: string[];
};

type Store = {
    products: Product[];
};

export const store: Store = { products };

const StoreContext = createContext<Store>(store);

export const Provider = StoreContext.Provider;
export const useStore = () => useContext(StoreContext);
