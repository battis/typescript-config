// https://stackoverflow.com/a/64117261
export type JSONPrimitive = string | number | boolean | null;

export type JSONArray = Array<JSONValue>;

export interface JSONObject {
  [k: string]: JSONValue;
}

export type JSONValue = JSONPrimitive | JSONArray | JSONObject;

/** @deprecated Default exports are not best practice */
export default JSONValue;

export function isJSONPrimitive(value: unknown): value is JSONPrimitive {
  return (
    value === null ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  );
}
