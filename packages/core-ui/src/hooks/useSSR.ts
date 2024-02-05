import { useContext } from 'react'

import { SSRContext } from '../context/SSRContext'

export const useSSR = () => {
  return useContext(SSRContext)
}
