import { darkThemeClass, lightThemeClass } from '#/styles/theme.css'
import { type ValueOf } from '#/types/utils'

import { setCookie } from './cookies'

export const THEME = {
  DARK: 'dark',
  LIGHT: 'light',
} as const

export type Theme = ValueOf<typeof THEME>

export const THEME_COOKIE = 'theme'

export const activateTheme = (theme: Theme) => {
  setCookie(THEME_COOKIE, theme)

  if (theme === THEME.DARK) {
    document.documentElement.classList.remove(lightThemeClass)
    document.documentElement.classList.add(darkThemeClass)
  } else {
    document.documentElement.classList.remove(darkThemeClass)
    document.documentElement.classList.add(lightThemeClass)
  }
}
