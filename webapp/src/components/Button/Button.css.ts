import { style, styleVariants } from '@vanilla-extract/css'

import { vars } from '@/styles/theme.css'

const baseButton = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.5rem',
  borderRadius: vars.radii.m,
})

export const button = styleVariants({
  ghost: [
    baseButton,
    {
      backgroundColor: 'transparent',

      ':hover': {
        backgroundColor: vars.color.slate100,
      },

      ':focus-visible': {
        backgroundColor: vars.color.slate100,
      },
    },
  ],
})

export const buttonIcon = style({
  selectors: {
    [`${button.ghost} &`]: {
      color: vars.color.icon,
    },
  },
})
