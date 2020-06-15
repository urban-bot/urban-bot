import React from 'react';
import { useBucket } from '../store/bucket';
import { Text } from '@urban-bot/core';

export function Bucket() {
    const { addedProducts } = useBucket();

    return <Text>{addedProducts.size}</Text>;
}
