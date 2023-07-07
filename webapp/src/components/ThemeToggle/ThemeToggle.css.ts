import { style } from '@vanilla-extract/css'

import { vars } from '#/styles/theme.css'

/**
 * Theme toggle design inspiration from https://codepen.io/anurag94/pen/MWYBWoN
 */
export const toggle = style({
  width: '1.5rem',
  height: '1.5rem',
  borderRadius: '50%',
  background: vars.color.yellow500,
  transition: 'all 0.3s ease-in-out',
  opacity: 0.8,

  ':hover': {
    opacity: 1,
  },
})

export const toggleDark = style({
  background: 'transparent',
  boxShadow: `inset -5px -4px 1px 1px ${vars.color.white}`,
})
