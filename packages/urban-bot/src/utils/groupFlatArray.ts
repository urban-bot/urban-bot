export function groupFlatArray<T>(arr: T[], groupLength: number): T[][] {
    if (groupLength < 1) {
        throw new Error(`groupLength should be more than zero`);
    }

    const groupArray = [];

    for (let startSliceIndex = 0, groupArrayIndex = 0; startSliceIndex < arr.length; startSliceIndex += groupLength) {
        groupArray[groupArrayIndex] = arr.slice(startSliceIndex, startSliceIndex + groupLength);

        groupArrayIndex += 1;
    }

    return groupArray;
}
