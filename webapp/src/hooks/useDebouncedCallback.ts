import { useCallback, useRef } from 'react'

import { type LiterallyAnything } from '#/types/utils'

/**
 * Create a debounced function that can be used in React.
 *
 * @param func This function needs to be passed in through `useCallback`!
 */
export const useDebouncedCallback = <
  F extends (...args: LiterallyAnything) => void,
  T extends Parameters<F>,
>(
  func: (...args: T) => void,
  wait: number,
) => {
  const timeout = useRef<ReturnType<typeof setTimeout>>()

  return useCallback(
    (...args: T) => {
      const later = () => {
        clearTimeout(timeout.current)
        func(...args)
      }

      clearTimeout(timeout.current)
      timeout.current = setTimeout(later, wait)
    },
    [func, wait],
  )
}
