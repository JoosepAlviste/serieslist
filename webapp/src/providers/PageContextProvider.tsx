import React from 'react'

import { PageContextContext } from '@/context'
import { type PageContext } from '@/renderer/types'

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
