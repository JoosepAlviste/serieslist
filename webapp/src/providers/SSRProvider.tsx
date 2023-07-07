import React, { type ReactElement, useEffect, useState } from 'react'

import { SSRContext } from '#/context'

type SSRProviderProps = {
  children: ReactElement
}

export const SSRProvider = ({ children }: SSRProviderProps) => {
  // On the server this should be `true`, and once the components are hydrated,
  // it should turn into `false`. Otherwise, if it's `true` on the server and
  // `false` on the client, then it will result in a hydration mismatch error.
  const [isSSR, setIsSSR] = useState(true)
  useEffect(() => {
    setIsSSR(false)
  }, [])

  return <SSRContext.Provider value={{ isSSR }}>{children}</SSRContext.Provider>
}
