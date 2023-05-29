import { style, styleVariants } from '@vanilla-extract/css'

import { iconColorVar } from '@/styles/cssVariables'
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
      color: vars.color.text,
      backgroundColor: 'transparent',

      ':hover': {
        backgroundColor: vars.color.inputBackground,
      },

      ':focus-visible': {
        backgroundColor: vars.color.inputBackground,
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
