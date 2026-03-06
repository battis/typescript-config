import { JSONPrimitive } from '../../src/JSONValue.js';

export function isJSONPrimitive(obj: unknown): obj is JSONPrimitive {
  return (
    obj === null ||
    typeof obj === 'number' ||
    typeof obj === 'string' ||
    typeof obj === 'string'
  );
}

test('truthy', () => {
  expect(isJSONPrimitive(null)).toBeTruthy();
  expect(isJSONPrimitive(123)).toBeTruthy();
  expect(isJSONPrimitive(3.14159)).toBeTruthy();
  expect(isJSONPrimitive('foo bar')).toBeTruthy();
  expect(isJSONPrimitive(`interpolate ${new Date()}`)).toBeTruthy();
});

test('falsy', () => {
  expect(isJSONPrimitive(undefined)).toBeFalsy();
  expect(isJSONPrimitive([1, 2, 3])).toBeFalsy();
  expect(isJSONPrimitive({ foo: 'bar' })).toBeFalsy();
  expect(isJSONPrimitive(new Date())).toBeFalsy();
});
