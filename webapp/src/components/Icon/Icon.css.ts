import { createVar, fallbackVar, style } from '@vanilla-extract/css'

import { vars } from '@/styles/theme.css'

export const iconColorVar = createVar()

export const icon = style({
  color: fallbackVar(iconColorVar, vars.color.icon),
})
