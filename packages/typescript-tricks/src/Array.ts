import { isKey, Key } from './Key';

// https://stackoverflow.com/a/51399781/294171
export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export function isEntries<K extends Key = Key, V = unknown>(
  obj: unknown,
  isK?: (k: unknown) => k is K,
  isV?: (v: unknown) => v is V
): obj is [K, V][] {
  return (
    Array.isArray(obj) &&
    (obj.length === 0 ||
      obj.reduce(
        (entries, elt) =>
          entries &&
          Array.isArray(elt) &&
          elt.length == 2 &&
          ((!isK && isKey(elt[0])) || (isK && isK(elt[0]))) &&
          (!isV || isV(elt[1])),
        true
      ))
  );
}
