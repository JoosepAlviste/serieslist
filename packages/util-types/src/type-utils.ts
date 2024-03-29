/* eslint-disable @typescript-eslint/no-explicit-any */
export type FixMe = any
export type ToDo = any
export type Inexpressible = any
export type NotWorthIt = any
export type UntypedLibrary = any
export type LiterallyAnything = any
/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * Make some fields of the give object type required.
 */
export type RequiredFields<T, K extends keyof T> = T & { [P in K]-?: T[P] }

/**
 * Get types of all values of an object (similar to keyof).
 */
export type ValueOf<T> = T[keyof T]

export type NonNullableFields<T, K extends keyof T> = Omit<T, K> & {
  [P in K]: NonNullable<T[P]>
}
