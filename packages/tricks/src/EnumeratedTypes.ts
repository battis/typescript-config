type EnumObject = { [key: string]: number | string };
type EnumObjectEnum<E extends EnumObject> = E extends {
  [key: string]: infer ET | string;
}
  ? ET
  : never;

/**
 * @see {@link https://blog.oyam.dev/typescript-enum-values/ How to get an array of enum values in TypeScript}
 */
export function getEnumValues<E extends EnumObject>(
  enumObject: E
): EnumObjectEnum<E>[] {
  return Object.keys(enumObject)
    .filter((key) => Number.isNaN(Number(key)))
    .map((key) => enumObject[key] as EnumObjectEnum<E>);
}
