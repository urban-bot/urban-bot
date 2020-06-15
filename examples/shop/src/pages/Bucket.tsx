import React from 'react';
import { useBucket } from '../store/bucket';
import { Text } from '@urban-bot/core';

export function Bucket() {
    const { addedProducts } = useBucket();
    const addedProductsArray = Array.from(addedProducts.values());

    const totalCount = addedProductsArray.reduce((totalCount, { count, price }) => totalCount + count * price, 0);

    if (addedProductsArray.length === 0) {
        return <Text>Bucket is empty</Text>;
    }

    return (
        <Text>
            {addedProductsArray.map((product) => {
                return (
                    <React.Fragment key={product.id}>
                        <i>{product.name}</i> - <b>{product.count}</b>
                        <br />
                    </React.Fragment>
                );
            })}
            -----------------------------------
            <br />
            Total count: <b>💲{totalCount}</b>
        </Text>
    );
}
