import { style } from '@vanilla-extract/css'

import { iconColorVar } from '@/styles/cssVariables'
import { vars } from '@/styles/theme.css'

export const logo = style({
  width: '3rem',
  height: '3rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: vars.radii.m,
  backgroundImage: `linear-gradient(135deg, ${vars.color.indigo500} 10%, ${vars.color.indigo600})`,
  outlineColor: vars.color.indigo200,
  transition: 'none',

  ':hover': {
    backgroundColor: vars.color.indigo600,
    backgroundImage: 'none',
  },

  vars: {
    [iconColorVar]: vars.color.white,
  },
})
