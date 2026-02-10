export function isRecord<K extends string | number | symbol, V>(
  obj: unknown,
  isK: (k: unknown) => k is K,
  isV: (v: unknown) => v is V
): obj is Record<K, V> {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    Object.keys(obj).reduce((result, key) => result && isK(key), true) &&
    Object.keys(obj)
      .map((key) => obj[key as keyof typeof obj])
      .reduce((result, value) => result && isV(value), true)
  );
}
