/** A string that is a number */
export type NumericString = string;

export function isNumericString(value?: unknown): value is NumericString {
  return (
    !!value &&
    typeof value === 'string' &&
    (((test: string) => {
      try {
        parseInt(test);
        return true;
      } catch (_) {
        return false;
      }
    })(value) ||
      ((test: string) => {
        try {
          parseFloat(test);
          return true;
        } catch (_) {
          return false;
        }
      })(value))
  );
}
