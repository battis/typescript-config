type Truthy = string;
type Falsy = string;

/** A string that represents a boolean value */
export type BooleanString<
  T extends Truthy = 'true',
  F extends Falsy = 'false'
> = T | F;

export function toBoolean<
  T extends Truthy = 'true',
  F extends Falsy = 'false',
  B extends BooleanString<T, F> = BooleanString<T, F>
>(value: B, truthy: T = 'true' as T, falsy?: F) {
  if (value === truthy) {
    return true;
  }
  if (falsy) {
    if (value === falsy) {
      return false;
    }
    return undefined;
  }
  return false;
}
