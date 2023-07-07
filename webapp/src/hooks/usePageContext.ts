import { useContext } from 'react'

import { PageContextContext } from '#/context'

export const usePageContext = () => {
  return useContext(PageContextContext)
}
