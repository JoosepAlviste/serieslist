import { createContext } from 'react'

import { type CurrentUserQuery } from '@/generated/gql/graphql'

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
