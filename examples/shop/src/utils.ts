export function calculateCircularIndex(index: number, arrayLength: number) {
    if (index < 0) {
        return arrayLength - 1;
    }

    if (index > arrayLength - 1) {
        return 0;
    }

    return index;
}
