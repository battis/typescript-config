import { isKey } from '../../src/Key';

test('truthy', () => {
  expect(isKey('a')).toBeTruthy();
  expect(isKey(0)).toBeTruthy();
  expect(isKey(Symbol('foo'))).toBeTruthy();
});

test('falsy', () => {
  expect(isKey(true)).toBeFalsy();
  expect(isKey({ foo: 'bar' })).toBeFalsy();
  expect(isKey(3.14159)).toBeFalsy();
});
