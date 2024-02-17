import { redirect } from 'vike/abort'
import type { GuardSync } from 'vike/types'

import { requireAuthentication } from '#/utils/redirect'

export const guard: GuardSync = (pageContext) => {
  requireAuthentication()(pageContext)

  throw redirect('/series/list/in-progress')
}
