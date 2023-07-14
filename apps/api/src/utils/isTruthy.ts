/**
 * Allows easily filtering an array with `.filter` with TypeScript.
 */
export const isTruthy = <T>(item: T): item is Exclude<T, null | undefined> =>
  Boolean(item)
