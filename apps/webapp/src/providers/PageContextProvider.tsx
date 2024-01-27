import React from 'react'
import type { PageContext } from 'vike/types'

import { PageContextContext } from '#/context'

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
