export type Constructor<T> = new (...args: any[]) => T;

export const isConstructor = (value: any): value is Constructor<any> => {
    return !!value && !!value.prototype && !!value.prototype.constructor;
};

// https://stackoverflow.com/a/65152869/294171
export function instanceOf<TElements, TFilter extends TElements>(
    array: TElements[],
    filterType: Constructor<TFilter>
): TFilter[] {
    return <TFilter[]>array.filter((e) => e instanceof filterType);
}
