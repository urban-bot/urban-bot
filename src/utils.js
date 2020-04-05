export function shallowEqual(obj1, obj2) {
    return Object.entries(obj1).every(([key1, value1]) => {
        return value1 === obj2[key1];
    });
}
