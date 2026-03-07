import { isJSONPrimitive } from '../../src/JSON';

test('truthy', () => {
  expect(isJSONPrimitive('foo')).toBeTruthy();
  expect(isJSONPrimitive(1)).toBeTruthy();
  expect(isJSONPrimitive(3.14159)).toBeTruthy();
  expect(isJSONPrimitive(true)).toBeTruthy();
  expect(isJSONPrimitive(false)).toBeTruthy();
  expect(isJSONPrimitive(null)).toBeTruthy();
});

test('falsy', () => {
  expect(isJSONPrimitive([])).toBeFalsy();
  expect(isJSONPrimitive({ a: 1 })).toBeFalsy();
  expect(isJSONPrimitive(undefined)).toBeFalsy();
});
