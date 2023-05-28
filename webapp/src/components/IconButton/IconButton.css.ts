import { style } from '@vanilla-extract/css'

import { iconColorVar } from '@/styles/cssVariables'
import { vars } from '@/styles/theme.css'

export const button = style({
  padding: '0.5rem',
  borderRadius: '50%',

  vars: {
    [iconColorVar]: vars.color.slate400,
  },

  ':hover': {
    backgroundColor: vars.color.slate100,

    vars: {
      [iconColorVar]: vars.color.slate500,
    },
  },
})
