import { useContext } from 'react'

import { SSRContext } from '#/context'

export const useSSR = () => {
  return useContext(SSRContext)
}
