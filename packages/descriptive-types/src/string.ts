/** A string that represents a date value without a time */
export type DateString<Format extends string = ''> = string;

/** A string that represents a time without a date */
export type TimeString<Format extends string = ''> = string;

/** A string that represents a date and time value */
export type DateTimeString<Format extends string = ''> = string;

/** A string that represents a time zone ID in standard format */
export type TimeZoneString = string;

/** A string that is a UUID */
export type UUIDString = string;

/** A string that is an email address */
export type EmailString = string;

/** A string that is a URL */
export type URLString = string;

/** A string that represents a file path */
export type PathString = string;

/** A string that contains HTML formatting tags */
export type HTMLString = string;

/** A string that is a number */
export type NumericString = string;

/** A string that is valid JSON */
export type JSONString = string;

/** A string that is a list of data of ItemType separated by Delimiter */
export type ListOf<
  ItemType extends string,
  Delimiter extends string = ','
> = string;
