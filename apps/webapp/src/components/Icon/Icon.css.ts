import {
  createVar,
  fallbackVar,
  style,
  styleVariants,
} from '@vanilla-extract/css'

import { SVG_COLOR_VAR } from '#/styles/simpleCssVariables'
import { vars } from '#/styles/theme.css'

export const iconColorVar = createVar()

export const icon = style({
  width: '1em',
  height: '1em',
  minWidth: '1em',

  vars: {
    [SVG_COLOR_VAR]: fallbackVar(iconColorVar, vars.color.icon),
  },
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
