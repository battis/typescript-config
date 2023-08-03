/**
 * @see {@link https://stackoverflow.com/a/49725198/294171 StackOverflow response} on requiring at least one property
 */
export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

/**
 * @see {@link https://stackoverflow.com/a/49725198/294171 StackOverflow response} on requiring only one property
 */
export type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> &
    Partial<Record<Exclude<Keys, K>, undefined>>;
  }[Keys];

/** @see {@link https://stackoverflow.com/a/51365037 StackOverflow response} */
export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
  ? RecursivePartial<U>[]
  : T[P] extends object | undefined
  ? RecursivePartial<T[P]>
  : T[P];
};
