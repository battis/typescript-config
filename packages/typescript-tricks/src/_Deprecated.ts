import { JSONPrimitive } from './JSON.js';

/** @deprecated Use Error.isError() */
export function isError(error: unknown): error is Error {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    'name' in error &&
    typeof error.name === 'string' &&
    typeof error.message === 'string'
  );
}

/** @deprecated Use Error.isError() */
export function CoerceError(error: unknown): Error {
  return Coerce<Error>(error, isError, (e) => e as Error);
}

/** @deprecated `null` is part of type unless using utility type `Nonnullable` */
export type Nullable<T> = T | null;

/** @deprecated Use `?` */
export type Optional<T> = T | undefined;

/** @deprecated Use `Record<string,T>` */
export type AssociativeArray<T> = { [key: string]: T };

/** @deprecated Use {@link JSONPrimitive} */
export type JSONPrimitiveTypes = JSONPrimitive;

/**
 * @deprecated See
 *   {@link https://www.typescriptlang.org/docs/handbook/mixins.html#constrained-mixins TypeScript docs}
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Mixin<T extends (...args: any[]) => any> = InstanceType<
  ReturnType<T>
>;

/** @deprecated Use {@link filterByType} */
export const instanceOf = filterByType;

/** @deprecated Use-case unclear */
export function Coerce<T>(
  u: unknown,
  isT: (u: unknown) => u is T,
  toT?: (u: unknown) => T
) {
  if (isT(u)) {
    return u;
  }
  try {
    if (toT) {
      return toT(u);
    } else {
      throw new Error('No toT() method provided');
    }
  } catch {
    throw new Error('Attempted coercion to a non-matching type');
  }
}

/** @deprecated Use-case unclear */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type Subset<T, U extends T> = T;
/** @deprecated Use-case unclear */
export type Constructor<T = object> = new (...args: unknown[]) => T;

/** @deprecated Use-case unclear */
export function isConstructor<T = unknown>(
  value: unknown
): value is Constructor<T> {
  return (
    !!value &&
    typeof value === 'object' &&
    'prototype' in value &&
    typeof value.prototype === 'object' &&
    !!value.prototype &&
    'constructor' in value.prototype.constructor
  );
}

/**
 * ```ts
 * class A {}
 * class B {}
 * class C extends A {}
 *
 * const a = new A();
 * const b = new B();
 * const c = new C();
 *
 * const list = [a, b, c];
 * const filteredList = filterByType(list, A);
 * // filteredList = [a, c]
 * ```
 *
 * @ see https://stackoverflow.com/a/65152869/294171
 *
 * @deprecated Use-case unclear
 */
export function filterByType<Elements, Filter extends Elements>(
  array: Elements[],
  filterType: Constructor<Filter>
): Filter[] {
  return <Filter[]>array.filter((e) => e instanceof filterType);
}
