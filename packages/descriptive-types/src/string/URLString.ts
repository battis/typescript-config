/** A string that is a URL */
export type URLString = string;

export function isURLString(value?: unknown): value is URLString {
  return (
    !!value &&
    typeof value === 'string' &&
    ((test) => {
      try {
        new URL(test);
        return true;
      } catch (_) {
        return false;
      }
    })(value)
  );
}
