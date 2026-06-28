/** A string that is valid JSON */
export type JSONString = string;

export function isJSONString(value?: unknown): value is JSONString {
  return (
    !!value &&
    typeof value === 'string' &&
    ((test: string) => {
      try {
        JSON.parse(test);
        return true;
      } catch (_) {
        return false;
      }
    })(value)
  );
}
