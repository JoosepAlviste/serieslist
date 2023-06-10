import { style, styleVariants } from '@vanilla-extract/css'

import { iconColorVar } from '@/styles/cssVariables'
import { vars } from '@/styles/theme.css'

export const button = style({
  padding: '0.5rem',
  borderRadius: '50%',

  ':hover': {
    backgroundColor: vars.color.inputBackground,
  },
})

export const variant = styleVariants({
  default: {
    vars: {
      [iconColorVar]: vars.color.iconButtonColor,
    },

    ':hover': {
      vars: {
        [iconColorVar]: vars.color.iconButtonHoverColor,
      },
    },
  },
  primary: {
    vars: {
      [iconColorVar]: vars.color.primary,
    },

    ':hover': {
      vars: {
        [iconColorVar]: vars.color.iconButtonPrimaryHoverColor,
      },
    },
  },
})
