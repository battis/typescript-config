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

