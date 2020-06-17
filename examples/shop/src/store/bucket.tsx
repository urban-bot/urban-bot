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
            const newAddedProducts = new Map(addedProducts);

            if (newAddedProducts.has(newProduct.id)) {
                const addedProduct = newAddedProducts.get(newProduct.id) as AddedProduct;

                addedProduct.count += 1;
            } else {
                newAddedProducts.set(newProduct.id, { ...newProduct, count: 1 });
            }

            return newAddedProducts;
        });
    }

    function removeProduct(deletedProduct: Product) {
        setAddedProducts((addedProducts) => {
            const addedProduct = addedProducts.get(deletedProduct.id);

            if (addedProduct === undefined) {
                return addedProducts;
            }

            const newAddedProducts = new Map(addedProducts);

            addedProduct.count -= 1;

            if (addedProduct.count === 0) {
                newAddedProducts.delete(deletedProduct.id);
            }

            return new Map(newAddedProducts);
        });
    }

    return (
        <BucketContext.Provider value={{ addedProducts, addProduct, removeProduct }}>{children}</BucketContext.Provider>
    );
}

export const useBucket = () => useContext(BucketContext);
