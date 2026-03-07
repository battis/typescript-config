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
