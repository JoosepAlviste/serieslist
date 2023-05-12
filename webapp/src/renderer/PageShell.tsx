import { ApolloProvider } from '@apollo/client'
import React from 'react'

import { Header, Navbar } from '@/components'
import { AuthenticatedUserProvider } from '@/features/auth'
import { PageContextProvider } from '@/hooks'

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
            <div className={s.pageContainer}>
              <Navbar />
              <main className={s.main}>
                <Header />
                {children}
              </main>
            </div>
          </AuthenticatedUserProvider>
        </PageContextProvider>
      </ApolloProvider>
    </React.StrictMode>
  )
}
