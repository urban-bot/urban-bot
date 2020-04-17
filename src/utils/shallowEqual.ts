interface MapType {
    [key: string]: any;
}

export function shallowEqual(obj1: MapType, obj2: MapType) {
    return Object.entries(obj1).every(([key1, value1]) => {
        return Object.is(value1, obj2[key1]);
    });
}
