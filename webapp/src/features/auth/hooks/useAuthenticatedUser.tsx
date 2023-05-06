import { useMutation, useQuery } from '@apollo/client'
import React, {
  createContext,
  useContext,
  type FC,
  type ReactNode,
} from 'react'

import { graphql } from '@/generated/gql'
import { type CurrentUserQuery } from '@/generated/gql/graphql'

export type AuthenticatedUser = NonNullable<CurrentUserQuery['me']>

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
  }

  return (
    <AuthenticatedUserContext.Provider
      value={{
        currentUser: data?.me ?? undefined,
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
