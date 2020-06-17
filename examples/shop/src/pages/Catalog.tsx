import React, { useState, useEffect } from 'react';
import { Image, ButtonGroup, Button, Text } from '@urban-bot/core';
import { calculateCircularIndex } from '../utils';
import { useProducts } from '../store/products';
import { useBucket } from '../store/bucket';

export function Catalog() {
    const [productIndex, setProductIndex] = useState(0);
    const [imageIndex, setImageIndex] = useState(0);
    const { products, fetchProducts } = useProducts();
    const { addProduct, addedProducts } = useBucket();

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    if (products.length === 0) {
        return <Text>Loading...</Text>;
    }

    const activeProduct = products[productIndex];

    function clickPreviousProduct() {
        setProductIndex(calculateCircularIndex(productIndex - 1, products.length));
        setImageIndex(0);
    }

    function clickNextProduct() {
        setProductIndex(calculateCircularIndex(productIndex + 1, products.length));
        setImageIndex(0);
    }

    function clickNextImage() {
        setImageIndex(calculateCircularIndex(imageIndex + 1, activeProduct.images.length));
    }

    function clickAddProductToBucket() {
        addProduct(activeProduct);
    }

    const addedProduct = addedProducts.get(activeProduct.id);
    const bucketCount = addedProduct ? addedProduct.count : 0;

    const title = (
        <>
            <i>{activeProduct.name}</i>
            <br />
            Price: <b>💲{activeProduct.price}</b>
        </>
    );

    return (
        <Image
            title={title}
            file={activeProduct.images[imageIndex]}
            buttons={
                <ButtonGroup maxColumns={2}>
                    <Button onClick={clickPreviousProduct}>⬅️ prev</Button>
                    <Button onClick={clickNextProduct}>next ➡️</Button>
                    {activeProduct.images.length > 1 ? <Button onClick={clickNextImage}>🖼️</Button> : null}
                    <Button onClick={clickAddProductToBucket}>{`Add to bucket (${bucketCount})`}</Button>
                </ButtonGroup>
            }
        />
    );
}
