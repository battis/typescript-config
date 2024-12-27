function FailedCoercion<T>(): T {
  throw new TypeError('Attempted coercion to a non-matching type');
}

export function Coerce<T>(
  u: unknown,
  isT: (u: unknown) => u is T,
  toT: (u: unknown) => T = FailedCoercion<T>
): T {
  if (isT(u)) {
    return u;
  }
  return toT(u);
}
