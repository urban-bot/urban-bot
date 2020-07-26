export function isArrayMatrix<T>(buttons: T | T[] | T[][]): buttons is T[][] {
    return Array.isArray(buttons) && Array.isArray(buttons[0]);
}
