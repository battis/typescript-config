/** @deprecated see {@link https://www.typescriptlang.org/docs/handbook/mixins.html#constrained-mixins TypeScript docs} */
export type Mixin<T extends (...args: any[]) => any> = InstanceType<
  ReturnType<T>
>;
