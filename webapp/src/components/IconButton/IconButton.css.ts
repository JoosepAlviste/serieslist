import { style } from '@vanilla-extract/css'

import { iconColorVar } from '@/styles/cssVariables'
import { vars } from '@/styles/theme.css'

export const button = style({
  padding: '0.5rem',
  borderRadius: '50%',

  vars: {
    [iconColorVar]: vars.color.iconButtonColor,
  },

  ':hover': {
    backgroundColor: vars.color.inputBackground,

    vars: {
      [iconColorVar]: vars.color.iconButtonHoverColor,
    },
  },
})
