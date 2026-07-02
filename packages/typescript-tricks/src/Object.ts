/**
 * @see {@link https://stackoverflow.com/a/69571314/294171 StackOverflow response} on static interfaces
 *
 * ```ts
 * interface InstanceInterface {
 *   instanceMethod();
 * }
 *
 * interface StaticInterface {
 *   new(...args: any[]): InstanceInterface;
 *   staticMethod();
 * }
 *
 * class MyClass implements StaticImplements<StaticInterface, typeof MyClass> {
 *   static staticMethod() { }
 *   static ownStaticMethod() { }
 *   instanceMethod() { }
 *   ownInstanceMethod() { }
 * }
 * ```
 */
export type StaticImplements<
  I extends new (...args: unknown[]) => object,
  C extends I
> = InstanceType<C>;

/**
 * A match for `{}`, especially useful if working with unions of types:
 *
 * ```ts
 * type MessyType = {} | {} | { example: number } | {} | {};
 *
 * // { example: number } only
 * type TidyType = Exclude<MessyType, EmptyObject>;
 * ```
 */
export type EmptyObject = Record<string, never>;
