export function isKey(value: unknown): value is keyof object {
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
  return isKey(value) && Object.keys(obj).includes(value);
}
