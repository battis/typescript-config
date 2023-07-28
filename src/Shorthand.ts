export type AsynchronousFunction = () => Promise<any>;
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Subset<T, U extends T> = T;
export type AssociativeArray<T> = { [key: string]: T };
