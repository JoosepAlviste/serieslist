import { ApolloProvider } from '@apollo/client'
import React from 'react'

import { Header, NavSidebar } from '@/components'
import { AuthenticatedUserProvider } from '@/features/auth'
import { PageContextProvider, ToastProvider } from '@/hooks'

import * as s from './PageShell.css'
import type { PageContext } from './types'

import './reset.css'
import './global.css'

export function PageShell({
  children,
  pageContext,
}: {
  children: React.ReactNode
  pageContext: PageContext
}) {
  return (
    <React.StrictMode>
      <ApolloProvider client={pageContext.apollo}>
        <PageContextProvider pageContext={pageContext}>
          <AuthenticatedUserProvider>
            <ToastProvider>
              <div className={s.pageContainer}>
                <NavSidebar />
                <main className={s.main}>
                  <Header />
                  {children}
                </main>
              </div>
            </ToastProvider>
          </AuthenticatedUserProvider>
        </PageContextProvider>
      </ApolloProvider>
    </React.StrictMode>
  )
}
