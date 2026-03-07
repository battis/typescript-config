import { isString } from '../../src/TypeJuggling';

test('truthy', () => {
  expect(isString('foo')).toBeTruthy();
  expect(isString('')).toBeTruthy();
  expect(isString(`bar`)).toBeTruthy();
});

test('falsy', () => {
  expect(isString(1)).toBeFalsy();
  expect(isString(undefined)).toBeFalsy();
  expect(isString(null)).toBeFalsy();
  expect(isString({ a: 123 })).toBeFalsy();
});
