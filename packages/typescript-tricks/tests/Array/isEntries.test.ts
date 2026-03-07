import { isEntries } from '../../src/Array';
import { isString } from '../../src/TypeJuggling';

test('truthy', () => {
  expect(isEntries([])).toBeTruthy();
  expect(isEntries([[1, 2]])).toBeTruthy();
  expect(
    isEntries([
      ['a', 1],
      [2, 'b']
    ])
  ).toBeTruthy();
});

test('falsy', () => {
  expect(isEntries({ a: 123 })).toBeFalsy();
  expect(isEntries([1, 2, 3])).toBeFalsy();
  expect(isEntries('foo')).toBeFalsy();
  expect(isEntries(['a', ['b', 1]])).toBeFalsy();
  expect(isEntries([['a', 1], ['b', 2], 'c'])).toBeFalsy();
});

test('typed', () => {
  expect(isEntries<string>([], isString)).toBeTruthy();
});
