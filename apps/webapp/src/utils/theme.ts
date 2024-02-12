import { colors } from '@serieslist/core-ui'
import type { ValueOf } from '@serieslist/util-types'

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
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', colors.black)
  } else {
    darkThemeClasses.forEach((className) => {
      document.documentElement.classList.remove(className)
    })
    lightThemeClasses.forEach((className) => {
      document.documentElement.classList.add(className)
    })
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', colors.white)
  }
}
