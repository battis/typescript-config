/** A string that represents a date value without a time */
export type DateString<_Format extends string = ''> = string;

/** A string that represents a time without a date */
export type TimeString<_Format extends string = ''> = string;

/** A string that represents a date and time value */
export type DateTimeString<_Format extends string = ''> = string;

export function isDateTimeString(value?: unknown): value is DateTimeString {
  return (
    !!value &&
    typeof value === 'string' &&
    ((test: string) => {
      try {
        new Date(test);
        return true;
      } catch (_) {
        return false;
      }
    })(value)
  );
}
