import React, { useContext, createContext } from 'react'

import { type NotWorthIt } from '@/types/utils'

import type { PageContext } from '../renderer/types'

const PageContextContext = createContext<PageContext>(
  // The context will always exist
  undefined as NotWorthIt as PageContext,
)

type PageContextProviderProps = {
  pageContext: PageContext
  children: React.ReactNode
}

export const PageContextProvider = ({
  pageContext,
  children,
}: PageContextProviderProps) => (
  <PageContextContext.Provider value={pageContext}>
    {children}
  </PageContextContext.Provider>
)

export const usePageContext = () => {
  return useContext(PageContextContext)
}
