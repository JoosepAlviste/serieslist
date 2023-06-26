/* eslint-disable @typescript-eslint/no-explicit-any */
export type FixMe = any
export type ToDo = any
export type Inexpressible = any
export type NotWorthIt = any
export type UntypedLibrary = any
export type LiterallyAnything = any
/* eslint-enable @typescript-eslint/no-explicit-any */

export type NonNullableFields<T, K extends keyof T> = Omit<T, K> & {
  [P in K]: NonNullable<T[P]>
}
