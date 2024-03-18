export type Constructor<T = object> = new (...args: any[]) => T;

export const isConstructor = (value: any): value is Constructor<any> => {
  return !!value && !!value.prototype && !!value.prototype.constructor;
};

/**
 * ```ts
 * class A {}
 * class B {}
 * class C extends A {}
 *
 * const a = new A();
 * const b = new B();
 * const c = new C();
 *
 * const list = [a, b, c];
 * const filteredList = instanceOf(list, A);
 * // filteredList = [a, c]
 * ```
 * @ see https://stackoverflow.com/a/65152869/294171
 */
export function filterByType<Elements, Filter extends Elements>(
  array: Elements[],
  filterType: Constructor<Filter>
): Filter[] {
  return <Filter[]>array.filter((e) => e instanceof filterType);
}

/** @deprecated use {@link filterByType} */
export const instanceOf = filterByType;
