export function isArrayMatrix<T>(elementOrArray: T | T[] | T[][]): elementOrArray is T[][] {
    return Array.isArray(elementOrArray) && Array.isArray(elementOrArray[0]);
}
