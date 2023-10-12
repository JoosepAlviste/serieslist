import { styleVariants } from '@vanilla-extract/css'

import { vars } from '#/styles/theme.css'

export const textSize = styleVariants({
  l: {
    fontSize: '1.125rem',
  },

  m: {
    fontSize: '1rem',
  },

  s: {
    fontSize: '0.875rem',
  },
})

export const textVariant = styleVariants({
  default: {
    color: vars.color.text,
  },

  secondary: {
    color: vars.color.textSecondary,
  },

  tertiary: {
    color: vars.color.textTertiary,
  },

  primary: {
    color: vars.color.primary,
  },
})

export const textWeight = styleVariants({
  regular: {
    fontWeight: vars.fontWeight.regular,
  },

  medium: {
    fontWeight: vars.fontWeight.medium,
  },

  bold: {
    fontWeight: vars.fontWeight.bold,
  },
})
