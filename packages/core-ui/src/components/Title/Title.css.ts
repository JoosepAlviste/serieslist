import { style, styleVariants } from '@vanilla-extract/css'

import { vars } from '../../theme.css'

export const title = style({
  color: vars.color.text,
  fontWeight: vars.fontWeight.medium,
})

export const titleSize = styleVariants({
  l: {
    fontSize: '2rem',
  },

  m: {
    fontSize: '1.5rem',
  },

  s: {
    fontSize: '1rem',
  },

  xs: {
    fontSize: '0.875rem',
  },
})

export const titleVariant = styleVariants({
  default: {
    color: vars.color.text,
  },

  tertiary: {
    color: vars.color.textTertiary,
  },
})
