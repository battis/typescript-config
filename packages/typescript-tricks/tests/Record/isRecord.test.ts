import { isJSONPrimitive, JSONPrimitive } from '../../src/JSON.js';
import { isKey, Key } from '../../src/Key.js';
import { isRecord } from '../../src/Record.js';
import { isString, isUnknown } from '../../src/TypeJuggling.js';

test('Record<string,string>', () => {
  expect(
    isRecord<string, string>({ foo: 'bar' }, isString, isString)
  ).toBeTruthy();
  expect(
    isRecord<string, string>({ foo: 123 }, isString, isString)
  ).toBeFalsy();
  expect(isRecord<string, string>(new Date(), isString, isString)).toBeFalsy();
});

test('Record<string,JSONPrimitive>', () => {
  expect(
    isRecord<string, JSONPrimitive>({ foo: 'bar' }, isString, isJSONPrimitive)
  ).toBeTruthy();
});

test('built-in objects', () => {
  expect(
    isRecord<Key, unknown>(new String('foo bar'), isKey, isUnknown)
  ).toBeFalsy();
  expect(isRecord<Key, unknown>(new Number(123), isKey, isUnknown)).toBeFalsy();
  expect(isRecord<Key, unknown>(Math.PI, isKey, isUnknown)).toBeFalsy();
  expect(
    isRecord<Key, unknown>(new Uint8Array(0), isKey, isUnknown)
  ).toBeFalsy();
  expect(isRecord<Key, unknown>(new Map(), isKey, isUnknown)).toBeFalsy();
  expect(isRecord<Key, unknown>(new Date(), isKey, isUnknown)).toBeFalsy();
});
