/**
 * @see https://stackoverflow.com/a/61940388
 */
export type MethodNames<T extends { [K in keyof T]: any }> = {
  [K in keyof T]: T[K] extends Function // is this key a function?
    ? K // yes, return the key
    : never; // no, return never
}[keyof T]; // get union of all values (which are now the keys) that are not never

export type MethodNamesMatching<
  T extends { [K in keyof T]: any },
  P extends Function = Function
> = {
  [K in keyof T]: T[K] extends Function // is this key a function?
    ? P extends T[K]
      ? K
      : never // yes, return the key
    : never; // no, return never
}[keyof T]; // get union of all values (which are now the keys) that are not never
