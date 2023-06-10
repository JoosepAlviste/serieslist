import { style } from '@vanilla-extract/css'

import { vars } from '@/styles/theme.css'

export const link = style({
  color: vars.color.link,
  textDecoration: 'none',

  ':hover': {
    color: vars.color.linkHover,
  },
})
