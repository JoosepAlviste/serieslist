import { style, keyframes } from '@vanilla-extract/css'

import { vars } from '#/styles/theme.css'

const rotate = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' },
})

export const loadingSpinner = style({
  width: '1rem',
  height: '1rem',
  borderWidth: 2,
  borderStyle: 'solid',
  borderTopColor: vars.color.primary,
  borderRightColor: 'transparent',
  borderBottomColor: vars.color.primary,
  borderLeftColor: 'transparent',
  borderRadius: '50%',
  display: 'inline-block',
  boxSizing: 'border-box',
  animationName: rotate,
  animationDuration: '1s',
  animationTimingFunction: 'linear',
  animationIterationCount: 'infinite',
})
