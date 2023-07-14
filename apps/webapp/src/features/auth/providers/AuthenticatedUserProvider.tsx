import { useMutation, useQuery } from '@apollo/client'
import React, { type FC, type ReactNode } from 'react'

import { graphql } from '#/generated/gql'
import { usePageContext } from '#/hooks'

import { AuthenticatedUserContext } from '../context/AuthenticatedUserContext'

type AuthenticatedUserProviderProps = {
  children: ReactNode
}

export const AuthenticatedUserProvider: FC<AuthenticatedUserProviderProps> = ({
  children,
}) => {
  const context = usePageContext()

  const { data, refetch } = useQuery(
    graphql(`
      query currentUser {
        me {
          __typename
          ... on User {
            id
            email
            name
          }
        }
      }
    `),
  )

  const currentUser = data?.me
    ? data.me.__typename === 'User'
      ? data.me
      : undefined
    : context.currentUser

  const [logOutMutate] = useMutation(
    graphql(`
      mutation logOut {
        logOut
      }
    `),
  )

  const logOut = async () => {
    await logOutMutate()
    await refetch()

    window.location.reload()
  }

  return (
    <AuthenticatedUserContext.Provider
      value={{
        currentUser,
        logOut,
      }}
    >
      {children}
    </AuthenticatedUserContext.Provider>
  )
}
