import { createContext } from 'react'

import type { Theme } from '#/utils/theme'

export const ThemeContext = createContext<{
  theme: Theme
  activateTheme: (theme: Theme) => void
}>({
  theme: 'light',
  activateTheme: () => undefined,
})
