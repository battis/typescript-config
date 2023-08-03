export type AsynchronousFunction = () => Promise<any>;

/** @deprecated `null` is part of type unless using utility type `Nonnullable` */
export type Nullable<T> = T | null;

/** @deprecated use `?` */
export type Optional<T> = T | undefined;

export type Subset<T, U extends T> = T;

/** @deprecated use `Record<string,T>` */
export type AssociativeArray<T> = { [key: string]: T };

export type JSONPrimitiveTypes = string | number | boolean | null;
