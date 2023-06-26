import {
  createVar,
  fallbackVar,
  style,
  styleVariants,
} from '@vanilla-extract/css'

import { vars } from '@/styles/theme.css'

export const iconColorVar = createVar()

export const icon = style({
  color: fallbackVar(iconColorVar, vars.color.icon),
  width: '1em',
  height: '1em',
  minWidth: '1em',
})

export const iconSize = styleVariants({
  s: {
    fontSize: '1rem',
  },

  m: {
    fontSize: '1.25rem',
  },

  l: {
    fontSize: '1.75rem',
  },
})
