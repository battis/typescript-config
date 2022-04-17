export declare type AsynchronousFunction = () => Promise<any>;
export declare type Nullable<T> = T | null;
export declare type Optional<T> = T | undefined;
export declare type Subset<T, U extends T> = T;
export declare type Constructor<T> = new (...args: any[]) => T;
export declare type Mixin<T extends (...args: any[]) => any> = InstanceType<ReturnType<T>>;
export declare function instanceOf<TElements, TFilter extends TElements>(array: TElements[], filterType: Constructor<TFilter>): TFilter[];
