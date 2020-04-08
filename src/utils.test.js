import { shallowEqual } from './utils';

test('adds 1 + 2 to equal 3', () => {
    expect(shallowEqual({ a: 1 }, { a: 1 })).toBe(true);
});
