import { groupFlatArray } from '../groupFlatArray';

describe('groupFlatArray', () => {
    it("can't pass zero", () => {
        expect(() => groupFlatArray([1, 2, 3], 0)).toThrowErrorMatchingSnapshot();
    });

    it("can't pass less than zero", () => {
        expect(() => groupFlatArray([1, 2, 3], -1)).toThrowErrorMatchingSnapshot();
    });

    it('return empty array', () => {
        expect(groupFlatArray([], 1)).toEqual([]);
    });

    it('return group array with one element', () => {
        expect(groupFlatArray([1], 1)).toEqual([[1]]);
        expect(groupFlatArray([1], 2)).toEqual([[1]]);
    });

    it('return group array with two elements', () => {
        expect(groupFlatArray([1, 2], 1)).toEqual([[1], [2]]);
        expect(groupFlatArray([1, 2], 2)).toEqual([[1, 2]]);
    });

    it('return group array with three elements', () => {
        expect(groupFlatArray([1, 2, 3], 1)).toEqual([[1], [2], [3]]);
        expect(groupFlatArray([1, 2, 3], 2)).toEqual([[1, 2], [3]]);
        expect(groupFlatArray([1, 2, 3], 3)).toEqual([[1, 2, 3]]);
    });

    it('return group array with four elements', () => {
        expect(groupFlatArray([1, 2, 3, 4], 2)).toEqual([
            [1, 2],
            [3, 4],
        ]);
        expect(groupFlatArray([1, 2, 3, 4], 3)).toEqual([[1, 2, 3], [4]]);
        expect(groupFlatArray([1, 2, 3, 4], 5)).toEqual([[1, 2, 3, 4]]);
    });
});
