export type AsynchronousFunction = () => Promise<any>;
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Subset<T, U extends T> = T;
export type Constructor<T> = new (...args: any[]) => T;
export type Mixin<T extends (...args: any[]) => any> = InstanceType<
  ReturnType<T>
>;
// https://stackoverflow.com/a/65152869/294171
export function instanceOf<TElements, TFilter extends TElements>(
  array: TElements[],
  filterType: Constructor<TFilter>
): TFilter[] {
  return <TFilter[]>array.filter((e) => e instanceof filterType);
}

// https://stackoverflow.com/a/48036194
const handler = {
  construct() {
    return handler;
  },
};
export const isConstructor = (value: any): value is Constructor<any> => {
  return !!value && !!value.prototype && !!value.prototype.constructor;
};
