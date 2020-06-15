import products from './products.json';
import { Product } from '../types';

export function fetchMockProducts(): Promise<Product[]> {
    return new Promise((resolve) => setTimeout(() => resolve(products), 1500));
}
