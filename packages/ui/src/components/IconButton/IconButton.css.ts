import { style, styleVariants } from '@vanilla-extract/css'

import { iconColorVar } from '../../cssVariables'
import { vars } from '../../theme.css'

export const button = style({
  padding: '0.5rem',
  borderRadius: '50%',

  ':hover': {
    backgroundColor: vars.color.inputSecondaryBackground,
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
