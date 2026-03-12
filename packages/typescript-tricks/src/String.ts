export type NonEmptyString = Exclude<string, ''>;

export function isNonEmptyString(value: unknown): value is NonEmptyString {
  return !!value && typeof value === 'string' && value.length > 0;
}

export function isString(obj: unknown): obj is string {
  return typeof obj === 'string';
}
