/** A number that represents a boolean value (1 or 0) */
export type NumericBoolean = 1 | 0;

/** A number that represents a timestamp value */
export type NumericTimestamp<_Format extends string> = number;

/** A number that represents time duration */
export type NumericDuration<_Units extends string> = number;
