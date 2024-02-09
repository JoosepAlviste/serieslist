/**
 * Return the first element in the array.
 */
export const head = <T>(array: T[]): T | undefined => array.at(0)

/**
 * Allows easily filtering an array with `.filter` with TypeScript.
 */
export const isTruthy = <T>(item: T): item is Exclude<T, null | undefined> =>
  Boolean(item)

/**
 * Create an array with the given length, filled with `null`s.
 */
export const createArrayOfLength = (length: number) =>
  /* eslint-disable-next-line prefer-spread*/
  Array.apply(null, Array(length))
