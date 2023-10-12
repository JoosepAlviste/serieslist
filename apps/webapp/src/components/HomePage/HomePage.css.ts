import { style } from '@vanilla-extract/css'

import { SVG_COLOR_VAR } from '#/styles/simpleCssVariables'
import { responsive, vars, zIndex } from '#/styles/theme.css'

export const container = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,

  '@media': {
    [responsive.m]: {
      flexDirection: 'column',
    },
  },
})

export const titleSide = style({
  flex: 1,
  padding: '1.75rem 2rem',
  marginBottom: '10rem',

  '@media': {
    [responsive.m]: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      marginBottom: 0,
      paddingBottom: 0,
    },
  },
})

export const title = style({
  paddingBottom: '0.75rem',
})

export const subtitle = style({
  maxWidth: '35rem',
})

export const background = style({
  position: 'fixed',
  inset: 0,
  zIndex: zIndex.homePage.background,
  background: `radial-gradient(circle at 77% 100%, rgba(99,102,241,0.2) 0%, rgba(99,102,241,0) 60%)`,

  '@media': {
    [responsive.m]: {
      background: `radial-gradient(circle at 50% 100%, rgba(99,102,241,0.2) 0%, rgba(99,102,241,0) 60%)`,
    },
  },
})

export const illustration = style({
  width: '100%',
  height: 'auto',
  maxHeight: '30rem',
  flex: 1,
  padding: '1.75rem 1rem',
})

const drawing = style({
  width: '4rem',
  height: '4rem',
  position: 'absolute',

  vars: {
    [SVG_COLOR_VAR]: vars.color.drawingColor,
  },

  '@media': {
    [responsive.m]: {
      display: 'none',
    },
  },
})

export const drawing1 = style([
  drawing,
  {
    top: '20%',
    left: '60%',
    transform: 'rotate(-53deg)',
  },
])

export const drawing2 = style([
  drawing,
  {
    top: '70%',
    left: '10%',
    transform: 'rotate(49deg)',
  },
])

export const heartfulMessage = style({
  position: 'absolute',
  bottom: '2rem',
  right: '4rem',

  '@media': {
    [responsive.m]: {
      bottom: '1rem',
      right: 0,
      left: 0,
      textAlign: 'center',
    },
  },
})
