import { redirect } from 'vike/abort'
import type { GuardSync } from 'vike/types'

export const guard: GuardSync = (pageContext) => {
  if (!pageContext.currentUser) {
    throw redirect('/')
  }

  throw redirect('/series/list/in-progress')
}
