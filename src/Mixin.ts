export type Mixin<T extends (...args: any[]) => any> = InstanceType<
    ReturnType<T>
>;
