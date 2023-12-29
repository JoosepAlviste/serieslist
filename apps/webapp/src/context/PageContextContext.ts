import { type NotWorthIt } from '@serieslist/type-utils'
import { createContext } from 'react'
import type { PageContext } from 'vike/types'

export const PageContextContext = createContext<PageContext>(
  // The context will always exist
  undefined as NotWorthIt as PageContext,
)
