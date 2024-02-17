import type { GuardSync } from 'vike/types'

import { requireNoAuthentication } from '#/utils/redirect'

export const guard: GuardSync = requireNoAuthentication()
