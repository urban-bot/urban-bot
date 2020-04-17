import { shallowEqual } from './shallowEqual';

describe('shallowEqual', () => {
    test('number compare', () => {
        expect(shallowEqual({ a: 1 }, { a: 1 })).toBe(true);
        expect(shallowEqual({ a: 1 }, { a: 2 })).toBe(false);
    });

    test('string compare', () => {
        expect(shallowEqual({ a: 'hello' }, { a: 'hello' })).toBe(true);
        expect(shallowEqual({ a: 'hello' }, { a: 'hell' })).toBe(false);
    });

    test('undefined null NaN compare', () => {
        expect(shallowEqual({ a: undefined }, { a: undefined })).toBe(true);
        expect(shallowEqual({ a: null }, { a: null })).toBe(true);
        expect(shallowEqual({ a: null }, { a: undefined })).toBe(false);
        expect(shallowEqual({ a: NaN }, { a: NaN })).toBe(true);
        expect(shallowEqual({ a: NaN }, { a: null })).toBe(false);
    });

    test('object compare', () => {
        const obj = {};
        expect(shallowEqual({ a: obj }, { a: obj })).toBe(true);
        expect(shallowEqual({ a: {} }, { a: {} })).toBe(false);

        const arr = [1, 2];
        expect(shallowEqual({ a: arr }, { a: arr })).toBe(true);
        expect(shallowEqual({ a: [1, 2] }, { a: [1, 2] })).toBe(false);
    });

    test('combine compare', () => {
        expect(shallowEqual({ a: 1 }, { b: 1 })).toBe(false);
        expect(shallowEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
        expect(shallowEqual({ a: 1, b: 2 }, { a: 1, b: 1 })).toBe(false);
        expect(shallowEqual({ a: 'hello', b: 'world' }, { a: 'hello', b: 'world' })).toBe(true);
        expect(shallowEqual({ a: 'hello', b: 'world' }, { a: 'hello', b: 'worl' })).toBe(false);
        expect(shallowEqual({ a: 'hello', b: [] }, { a: [], b: 'hello' })).toBe(false);
    });
});
