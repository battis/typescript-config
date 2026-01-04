// https://stackoverflow.com/a/64117261
export type JSONPrimitive = string | number | boolean | null;

export type JSONArray = Array<JSONValue>;

export interface JSONObject {
  [k: string]: JSONValue;
}

export type JSONValue = JSONPrimitive | JSONArray | JSONObject;

export default JSONValue;
