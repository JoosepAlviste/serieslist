import type { GuardSync } from 'vike/types'

import { requireAuthentication } from '#/utils/redirect'

export const guard: GuardSync = requireAuthentication()
