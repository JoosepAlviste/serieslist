import { createContext } from 'react'

import { type NotWorthIt } from '#/types/utils'

import type { PageContext } from '../renderer/types'

export const PageContextContext = createContext<PageContext>(
  // The context will always exist
  undefined as NotWorthIt as PageContext,
)
