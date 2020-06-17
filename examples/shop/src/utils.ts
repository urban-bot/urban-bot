export function calculateCircularIndex(index: number, arrayLength: number) {
    return (arrayLength + index) % arrayLength;
}
