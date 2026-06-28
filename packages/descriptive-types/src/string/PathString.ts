import isValidPath from 'is-valid-path';

/** A string that represents a file path */
export type PathString = string;

export function isPathString(value?: unknown): value is PathString {
  return !!value && typeof value === 'string' && isValidPath(value);
}
