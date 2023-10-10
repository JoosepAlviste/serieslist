import { style } from '@vanilla-extract/css'

import { responsive, vars } from '#/styles/theme.css'

export const page = style({
  maxWidth: '80ch',
  marginTop: '1rem',

  '@media': {
    [responsive.m]: {
      paddingLeft: '1rem',
      paddingRight: '1rem',
    },
  },
})

export const title = style({
  marginBottom: '1rem',
})

export const tmdbLogo = style({
  width: '14rem',
  height: '1rem',
  marginTop: '1rem',
})
