import { createContext } from 'react'
import type { PageContext } from 'vite-plugin-ssr/types'

import { type NotWorthIt } from '#/types/utils'

export const PageContextContext = createContext<PageContext>(
  // The context will always exist
  undefined as NotWorthIt as PageContext,
)
