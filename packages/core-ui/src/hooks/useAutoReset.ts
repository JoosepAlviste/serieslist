import { useCallback, useState } from 'react'

import { useDebouncedCallback } from './useDebouncedCallback'

/**
 * A state value that automatically resets to the default value after `timeout`
 * ms.
 */
export function useAutoReset<T>(defaultValue: T, timeout: number) {
  const [value, setValueBase] = useState(defaultValue)

  const resetToDefault = useDebouncedCallback(
    useCallback(() => {
      setValueBase(defaultValue)
    }, [defaultValue]),
    timeout,
  )

  const setValue = (val: T) => {
    setValueBase(val)
    resetToDefault()
  }

  return [value, setValue] as const
}
