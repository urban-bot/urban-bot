import React, { createContext, useContext } from 'react';
import { Product } from '../types';

export type AddedProduct = Product & { count: number };

export type AddedProducts = Map<number, AddedProduct>;

type BucketContextType = {
    addedProducts: AddedProducts;
    addProduct: (product: Product) => void;
    removeProduct: (product: Product) => void;
};

const BucketContext = createContext<BucketContextType>({} as BucketContextType);

type BucketProviderProps = {
    children: React.ReactNode;
};

export function BucketProvider({ children }: BucketProviderProps) {
    const [addedProducts, setAddedProducts] = React.useState<AddedProducts>(new Map());

    function addProduct(newProduct: Product) {
        setAddedProducts((addedProducts) => {
            if (addedProducts.has(newProduct.id)) {
                const addedProduct = addedProducts.get(newProduct.id) as AddedProduct;

                addedProduct.count += 1;
            } else {
                addedProducts.set(newProduct.id, { ...newProduct, count: 1 });
            }

            return new Map(addedProducts);
        });
    }

    function removeProduct(deletedProduct: Product) {
        if (addedProducts.has(deletedProduct.id)) {
            const addedProduct = addedProducts.get(deletedProduct.id) as AddedProduct;

            addedProduct.count -= 1;

            if (addedProduct.count === 0) {
                addedProducts.delete(deletedProduct.id);
            }

            return new Map(addedProducts);
        }
    }

    return (
        <BucketContext.Provider value={{ addedProducts, addProduct, removeProduct }}>{children}</BucketContext.Provider>
    );
}

export const useBucket = () => useContext(BucketContext);
