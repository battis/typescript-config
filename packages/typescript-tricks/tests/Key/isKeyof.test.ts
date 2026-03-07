import { isKeyof } from '../../src/Key';

test('truthy', () => {
  expect(isKeyof('a', { a: 1 })).toBeTruthy();
  expect(isKeyof(1, { 1: 'foo' })).toBeTruthy();
  const s = Symbol('foo');
  expect(isKeyof(s, { [s]: 'bar' })).toBeTruthy();
});

test('falsy', () => {
  expect(isKeyof('a', { b: 2 })).toBeFalsy();
});
