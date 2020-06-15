import React, { createContext, useContext, useCallback } from 'react';
import { fetchMockProducts } from '../api';
import { Product } from '../types';

type ProductsContextType = {
    products: Product[];
    fetchProducts: () => void;
};

const ProductsContext = createContext<ProductsContextType>({} as ProductsContextType);

type ProductsProviderProps = {
    children: React.ReactNode;
};

export function ProductsProvider({ children }: ProductsProviderProps) {
    const [products, setProducts] = React.useState<Product[]>([]);

    const fetchProducts = useCallback(async () => {
        const products = await fetchMockProducts();

        setProducts(products);
    }, []);

    return <ProductsContext.Provider value={{ products, fetchProducts }}>{children}</ProductsContext.Provider>;
}

export const useProducts = () => useContext(ProductsContext);
