import { ApolloProvider } from '@apollo/client'
import React from 'react'

import { Navbar } from '@/components'
import { AuthenticatedUserProvider } from '@/features/auth'
import { PageContextProvider } from '@/hooks'

import type { PageContext } from './types'

import './reset.css'
import './global.css'
import './PageShell.css'

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
            <Layout>
              <Navbar />
              <Content>{children}</Content>
            </Layout>
          </AuthenticatedUserProvider>
        </PageContextProvider>
      </ApolloProvider>
    </React.StrictMode>
  )
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        maxWidth: 900,
        margin: 'auto',
      }}
    >
      {children}
    </div>
  )
}

function Content({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: 20,
        paddingBottom: 50,
        borderLeft: '2px solid #eee',
        minHeight: '100vh',
      }}
    >
      {children}
    </div>
  )
}
