import { style, styleVariants } from '@vanilla-extract/css'

import { iconColorVar } from '@/styles/cssVariables'
import { vars } from '@/styles/theme.css'

const baseButton = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
})

export const disabled = style({
  cursor: 'not-allowed',
})

export const buttonSize = styleVariants({
  s: {
    fontSize: '0.875rem',
    padding: '0.375rem 1rem',
    borderRadius: vars.radii.s,
  },
  m: {
    fontSize: '1rem',
    padding: '0.5rem 1rem',
    borderRadius: vars.radii.m,
  },
  l: {
    fontSize: '1rem',
    padding: '0.75rem 1rem',
    borderRadius: vars.radii.m,
  },
})

export const button = styleVariants({
  ghost: [
    baseButton,
    {
      color: vars.color.text,
      backgroundColor: 'transparent',

      selectors: {
        [`&:not(${disabled}):hover`]: {
          backgroundColor: vars.color.inputSecondaryBackground,
        },

        [`&:not(${disabled}):focus-visible`]: {
          backgroundColor: vars.color.inputSecondaryBackground,
        },
      },
    },
  ],
  primary: [
    baseButton,
    {
      color: vars.color.white,
      backgroundColor: vars.color.primary,

      selectors: {
        [`&${disabled}`]: {
          backgroundColor: vars.color.buttonPrimaryDisabledBackground,
        },

        [`&:not(${disabled}):hover`]: {
          backgroundColor: vars.color.buttonPrimaryHoverBackground,
        },

        [`&:not(${disabled}):focus-visible`]: {
          backgroundColor: vars.color.buttonPrimaryHoverBackground,
        },
      },
    },
  ],
  secondary: [
    baseButton,
    {
      color: vars.color.text,
      backgroundColor: vars.color.buttonSecondaryBackground,

      selectors: {
        [`&:not(${disabled}):hover`]: {
          backgroundColor: vars.color.buttonSecondaryHoverBackground,
        },

        [`&:not(${disabled}):focus-visible`]: {
          backgroundColor: vars.color.buttonSecondaryHoverBackground,
        },
      },
    },
  ],
})

export const buttonIcon = style({
  selectors: {
    [`${button.ghost} &`]: {
      vars: {
        [iconColorVar]: vars.color.inputIconColor,
      },
    },
  },
})
