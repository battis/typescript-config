import { isUnknown } from '../../src/TypeJuggling';

test('truthy', () => {
  expect(isUnknown(true)).toBeTruthy();
  expect(isUnknown(null)).toBeTruthy();
  expect(isUnknown({ a: 123 })).toBeTruthy();
});
