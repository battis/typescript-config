export type AsynchronousFunction = () => Promise<unknown>;

/** @see https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types#comment123255834_53229567 */
type UnionKeys<T> = T extends T ? keyof T : never;
// Improve intellisense
type Expand<T> = T extends T ? { [K in keyof T]: T[K] } : never;
export type OneOf<T extends object[]> = {
  [K in keyof T]: Expand<
    T[K] & Partial<Record<Exclude<UnionKeys<T[number]>, keyof T[K]>, never>>
  >;
}[number];

export function isUnknown(obj: unknown): obj is unknown {
  return true;
}

export function isString(obj: unknown): obj is string {
  return typeof obj === 'string';
}

/**
 * Caution: if an object may be a generator (in which case obj.iterator returns
 * `this`), it will be consumed
 */
export function isIterable<T = unknown>(
  obj: unknown,
  isT?: (elt: unknown) => elt is T
): obj is Iterable<T> {
  function _isIterable(obj: unknown): obj is Iterable<unknown> {
    return !!obj && typeof obj === 'object' && Symbol.iterator in obj;
  }
  if (_isIterable(obj)) {
    if (isT) {
      for (const elt of obj) {
        if (!isT(elt)) {
          return false;
        }
      }
    }
    return true;
  }
  return false;
}
