import { style } from '@vanilla-extract/css'

import { responsive } from '#/styles/theme.css'

export const page = style({
  maxWidth: '80ch',
  marginTop: '1rem',
  marginBottom: '3rem',

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
