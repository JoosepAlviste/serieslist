// `usePageContext` allows us to access `pageContext` in any React component.
// See https://vite-plugin-ssr.com/pageContext-anywhere

import React, { useContext, createContext } from 'react'

import { type NotWorthIt } from '@/types/utils'

import type { PageContext } from './types'

const Context = createContext<PageContext>(
  // The context will always exist
  undefined as NotWorthIt as PageContext,
)

export function PageContextProvider({
  pageContext,
  children,
}: {
  pageContext: PageContext
  children: React.ReactNode
}) {
  return <Context.Provider value={pageContext}>{children}</Context.Provider>
}

export function usePageContext() {
  const pageContext = useContext(Context)
  return pageContext
}
