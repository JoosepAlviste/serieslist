import {
  vars as uiVars,
  lightThemeClass as uiLightThemeClass,
  darkThemeClass as uiDarkThemeClass,
} from '@serieslist/core-ui'
import { createTheme } from '@vanilla-extract/css'

const colors = uiVars.color

const [appLightThemeClass, appVars] = createTheme({
  color: {
    navIconBackground: colors.slate100,
    navIconHoverBackground: colors.slate200,
    navIconActiveBackground: colors.slate200,
    navIconActiveColor: colors.slate500,

    searchHighlightBackground: colors.indigo50,

    drawingColor: colors.slate300,
  },
})

const appDarkThemeClass = createTheme(appVars, {
  color: {
    navIconBackground: colors.slate900,
    navIconHoverBackground: colors.slate800,
    navIconActiveBackground: colors.slate700,
    navIconActiveColor: colors.slate100,

    searchHighlightBackground: colors.indigo950,

    drawingColor: colors.slate700,
  },
})

export const lightThemeClasses = [uiLightThemeClass, appLightThemeClass]
export const darkThemeClasses = [uiDarkThemeClass, appDarkThemeClass]
export const vars = {
  ...uiVars,
  ...appVars,
  color: {
    ...uiVars.color,
    ...appVars.color,
  },
}

export const responsive = {
  s: 'screen and (max-width: 320px)',
  m: 'screen and (max-width: 768px)',
  l: 'screen and (max-width: 1200px)',
}

export const colorTransition = 'color 200ms ease-in-out'

const base = 1
const above = 1
const below = -1

const zLayoutHeader = above + base
const zLayoutToast = above + zLayoutHeader
const zLayoutSelect = above + zLayoutHeader
const zLayoutDropdownMenu = above + zLayoutHeader
const zLayoutTooltip = above + zLayoutHeader
const zHomePageBackground = below + below + base
const zAuthLayoutSeparator = base
const zSearchPopover = above + zLayoutHeader

export const zIndex = {
  layout: {
    header: zLayoutHeader,
    toast: zLayoutToast,
    select: zLayoutSelect,
    dropdownMenu: zLayoutDropdownMenu,
    tooltip: zLayoutTooltip,
  },
  homePage: {
    background: zHomePageBackground,
  },
  authLayout: {
    separator: zAuthLayoutSeparator,
  },
  search: {
    popover: zSearchPopover,
  },
}
