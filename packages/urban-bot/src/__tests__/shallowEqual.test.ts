import { shallowEqual } from '../utils/shallowEqual';

describe('shallowEqual', () => {
    it('number compare', () => {
        expect(shallowEqual({ a: 1 }, { a: 1 })).toBe(true);
        expect(shallowEqual({ a: 1 }, { a: 2 })).toBe(false);
    });

    it('string compare', () => {
        expect(shallowEqual({ a: 'hello' }, { a: 'hello' })).toBe(true);
        expect(shallowEqual({ a: 'hello' }, { a: 'hell' })).toBe(false);
    });

    it('undefined null NaN compare', () => {
        expect(shallowEqual({ a: undefined }, { a: undefined })).toBe(true);
        expect(shallowEqual({ a: null }, { a: null })).toBe(true);
        expect(shallowEqual({ a: null }, { a: undefined })).toBe(false);
        expect(shallowEqual({ a: NaN }, { a: NaN })).toBe(true);
        expect(shallowEqual({ a: NaN }, { a: null })).toBe(false);
    });

    it('object compare', () => {
        const obj = {};
        expect(shallowEqual({ a: obj }, { a: obj })).toBe(true);
        expect(shallowEqual({ a: {} }, { a: {} })).toBe(false);

        const arr = [1, 2];
        expect(shallowEqual({ a: arr }, { a: arr })).toBe(true);
        expect(shallowEqual({ a: [1, 2] }, { a: [1, 2] })).toBe(false);
    });

    it('combine compare', () => {
        expect(shallowEqual({ a: 1 }, { b: 1 })).toBe(false);
        expect(shallowEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
        expect(shallowEqual({ a: 1, b: 2 }, { a: 1, b: 1 })).toBe(false);
        expect(shallowEqual({ a: 'hello', b: 'world' }, { a: 'hello', b: 'world' })).toBe(true);
        expect(shallowEqual({ a: 'hello', b: 'world' }, { a: 'hello', b: 'worl' })).toBe(false);
        expect(shallowEqual({ a: 'hello', b: [] }, { a: [], b: 'hello' })).toBe(false);
    });

    it('compare the same ', () => {
        const obj = { a: 1 };

        expect(shallowEqual(obj, obj)).toBe(true);
    });

    it('compare empty ', () => {
        const obj1 = {};
        const obj2 = {};

        expect(shallowEqual(obj1, obj2)).toBe(true);
    });

    it('compare with different length', () => {
        const obj1 = { a: 1 };
        const obj2 = { a: 1, b: 1 };

        expect(shallowEqual(obj1, obj2)).toBe(false);
    });
});
