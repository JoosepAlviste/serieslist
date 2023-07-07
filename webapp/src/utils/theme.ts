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
    document.body.classList.remove(lightThemeClass)
    document.body.classList.add(darkThemeClass)
  } else {
    document.body.classList.remove(darkThemeClass)
    document.body.classList.add(lightThemeClass)
  }
}
