export type Key = string | number | symbol;

export function isKey(value: unknown): value is Key {
  return (
    value !== undefined &&
    (typeof value === 'string' ||
      (typeof value === 'number' && parseInt(value.toString())) === value ||
      typeof value === 'symbol')
  );
}

export function isKeyof<T extends object>(
  value: unknown,
  obj: T
): value is keyof T {
  return (
    isKey(value) &&
    ((typeof value === 'string' && Object.keys(obj).includes(value)) ||
      (typeof value === 'number' &&
        Object.keys(obj).includes(value.toString())) ||
      (typeof value === 'symbol' &&
        Object.getOwnPropertySymbols(obj).includes(value)))
  );
}
