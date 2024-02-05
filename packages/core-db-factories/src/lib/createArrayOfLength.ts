/**
 * Create an array with the given length, filled with `null`s.
 */
export const createArrayOfLength = (length: number) =>
  /* eslint-disable-next-line prefer-spread*/
  Array.apply(null, Array(length))
