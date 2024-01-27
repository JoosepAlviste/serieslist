import type { ValueOf } from '@serieslist/type-utils'

import { darkThemeClasses, lightThemeClasses } from '#/styles/theme.css'

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
    lightThemeClasses.forEach((className) => {
      document.documentElement.classList.remove(className)
    })
    darkThemeClasses.forEach((className) => {
      document.documentElement.classList.add(className)
    })
  } else {
    darkThemeClasses.forEach((className) => {
      document.documentElement.classList.remove(className)
    })
    lightThemeClasses.forEach((className) => {
      document.documentElement.classList.add(className)
    })
  }
}
