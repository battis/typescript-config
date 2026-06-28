import isTimezone from 'is-timezone';

/** A string that represents an IANA time zone name */
export type TimeZoneString = string;

export function isTimeZoneString(value?: unknown): value is TimeZoneString {
  return !!value && typeof value === 'string' && isTimezone(value);
}
