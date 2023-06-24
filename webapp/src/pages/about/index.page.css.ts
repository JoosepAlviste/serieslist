import { style } from '@vanilla-extract/css'

import { responsive, vars } from '@/styles/theme.css'

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
  fontSize: '1.5rem',
  fontWeight: vars.fontWeight.medium,
  marginBottom: '1rem',
})

export const tmdbLogo = style({
  width: '14rem',
  height: '1rem',
  marginTop: '1rem',
})
