//https://stackoverflow.com/a/54178819
export type OptionalProperty<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;
