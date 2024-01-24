import { MapType } from '../types';

export function shallowEqual(obj1: MapType, obj2: MapType) {
    if (obj1 === obj2) {
        return true;
    }

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
        return false;
    }

    return keys1.every((key1) => {
        return Object.is(obj1[key1], obj2[key1]);
    });
}
