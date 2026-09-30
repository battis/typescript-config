/* eslint-disable @typescript-eslint/no-empty-object-type */

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

/**
 * @see https://stackoverflow.com/a/49579497  
 * @see https://stackoverflow.com/a/52473108
 */
type IfEquals<X, Y, A = X, B = never> =
  (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? A : B;

/**
 * Example usage:
 *
 * ```ts
 * type Example = {
 *   readonly a: number;
 *   b: boolean;
 *   c: string;
 * }
 *
 * type WritableExample = Pick<Example, WritableKeys<Example>>;
 * ```
 *
 * `WritableExample` is:
 *
 * ```ts
 * type WritableExample = {
 *   b: boolean;
 *   c: string;
 * }
 * ```
 */
export type WritableKeys<T> = {
  [P in keyof T]-?: IfEquals<
    { [Q in P]: T[P] },
    { -readonly [Q in P]: T[P] },
    P
  >;
}[keyof T];

/**
 * Example usage:
 *
 * ```ts
 * type Example = {
 *   readonly a: number;
 *   b: boolean;
 *   c: string;
 * }
 *
 * type ReadonlyExample = Pick<Example, ReadonlyKeys<Example>>;
 * ```
 *
 * `ReadonlyExample` is:
 *
 * ```ts
 * type ReadonlyExample = {
 *   readonly a: number;
 * }
 * ```
 */
export type ReadonlyKeys<T> = {
  [P in keyof T]-?: IfEquals<
    { [Q in P]: T[P] },
    { -readonly [Q in P]: T[P] },
    never,
    P
  >;
}[keyof T];

export type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends { [P in K]: T[K] } ? never : K;
}[keyof T];

export type OptionalKeys<T> = {
  [K in keyof T]-?: {} extends { [P in K]: T[K] } ? K : never;
}[keyof T];
