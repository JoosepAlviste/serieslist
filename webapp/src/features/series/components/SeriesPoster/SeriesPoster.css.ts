import { style } from '@vanilla-extract/css'

import { vars } from '@/styles/theme.css'

export const posterContainer = style({
  height: '4rem',
  aspectRatio: '2 / 3',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

export const poster = style({
  borderRadius: vars.radii.s,
})
