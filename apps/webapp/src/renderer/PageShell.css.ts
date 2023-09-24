import { style } from '@vanilla-extract/css'

import { responsive, vars, zIndex } from '#/styles/theme.css'

const NAVBAR_HEIGHT_REM = 4.5
const NAVBAR_HEIGHT_MOBILE_REM = 5
const SIDEBAR_WIDTH_REM = 6

export const header = style({
  position: 'fixed',
  top: 0,
  left: `${SIDEBAR_WIDTH_REM}rem`,
  right: 0,
  background: vars.color.pageBackground,
  zIndex: zIndex.layout.header,

  '@media': {
    [responsive.m]: {
      left: 0,
    },
  },
})

export const nav = style({
  position: 'fixed',
  top: 0,
  left: 0,
  bottom: 0,

  '@media': {
    [responsive.m]: {
      display: 'none',
    },
  },
})

export const main = style({
  paddingTop: `${NAVBAR_HEIGHT_REM}rem`,
  paddingLeft: `${SIDEBAR_WIDTH_REM}rem`,
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',

  '@media': {
    [responsive.m]: {
      paddingLeft: 0,
      paddingTop: `${NAVBAR_HEIGHT_MOBILE_REM}rem`,
    },
  },
})
