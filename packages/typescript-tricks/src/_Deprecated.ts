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
