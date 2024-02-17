import { redirect } from 'vike/abort'
import type { GuardSync } from 'vike/types'

const UNAUTHENTICATED_DEFAULT_URL = '/'
const AUTHENTICATED_DEFAULT_URL = '/series/list/in-progress'

export const requireAuthentication =
  (redirectTo = UNAUTHENTICATED_DEFAULT_URL): GuardSync =>
  (pageContext) => {
    if (!pageContext.currentUser) {
      throw redirect(redirectTo)
    }
  }

export const requireNoAuthentication =
  (redirectTo = AUTHENTICATED_DEFAULT_URL): GuardSync =>
  (pageContext) => {
    if (pageContext.currentUser) {
      throw redirect(redirectTo)
    }
  }
