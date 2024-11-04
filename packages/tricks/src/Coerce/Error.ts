import { Coerce } from './Coerce.js';

function isError(error: unknown): error is Error {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    'name' in error &&
    typeof error.name === 'string' &&
    typeof error.message === 'string'
  );
}
export function coerceError(error: unknown): Error {
  return Coerce<Error>(error, isError, (e) => new Error(String(e)));
}
