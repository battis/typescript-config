import { JSONPrimitive } from '../../src/JSONValue.js';
import { isRecord } from '../../src/Record.js';
import { isJSONPrimitive } from '../JSONValue/JSONPrimitive.test.js';

function isKey(obj: unknown): obj is keyof object {
  return (
    typeof obj === 'string' ||
    typeof obj === 'number' ||
    typeof obj === 'symbol'
  );
}

function isUnknown(obj: unknown): obj is unknown {
  return true;
}

function isString(obj: unknown): obj is string {
  return typeof obj === 'string';
}

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
    isRecord<keyof object, unknown>(new String('foo bar'), isKey, isUnknown)
  ).toBeFalsy();
  expect(
    isRecord<keyof object, unknown>(new Number(123), isKey, isUnknown)
  ).toBeFalsy();
  expect(
    isRecord<keyof object, unknown>(Math.PI, isKey, isUnknown)
  ).toBeFalsy();
  expect(
    isRecord<keyof object, unknown>(new Uint8Array(0), isKey, isUnknown)
  ).toBeFalsy();
  expect(
    isRecord<keyof object, unknown>(new Map(), isKey, isUnknown)
  ).toBeFalsy();
  expect(
    isRecord<keyof object, unknown>(new Date(), isKey, isUnknown)
  ).toBeFalsy();
});
