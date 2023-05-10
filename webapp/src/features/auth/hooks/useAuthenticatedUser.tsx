import { useMutation, useQuery } from '@apollo/client'
import React, {
  createContext,
  useContext,
  type FC,
  type ReactNode,
} from 'react'
import { navigate } from 'vite-plugin-ssr/client/router'

import { graphql } from '@/generated/gql'
import { type CurrentUserQuery } from '@/generated/gql/graphql'
import { usePageContext } from '@/hooks'

export type AuthenticatedUser = Exclude<
  NonNullable<CurrentUserQuery['me']>,
  { __typename: 'UnauthorizedError' }
>

export const AuthenticatedUserContext = createContext<{
  currentUser: AuthenticatedUser | undefined
  logOut: () => Promise<void>
}>({
  currentUser: undefined,
  logOut: () => Promise.resolve(undefined),
})

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

    await navigate(window.location.pathname)
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

export const useAuthenticatedUser = () => {
  return useContext(AuthenticatedUserContext)
}
