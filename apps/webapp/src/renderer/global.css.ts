import { globalStyle } from '@vanilla-extract/css'

import { SVG_COLOR_VAR } from '#/styles/simpleCssVariables'
import { vars } from '#/styles/theme.css'

globalStyle(':root', {
  vars: {
    [SVG_COLOR_VAR]: vars.color.icon,
  },
})

globalStyle('body', {
  fontFamily: 'Inter, sans-serif',
  color: vars.color.text,
  background: vars.color.pageBackground,
})

globalStyle('*', {
  outlineWidth: 0,
  outlineStyle: 'solid',
  outlineColor: vars.color.primary,
  transition:
    'outline-width 100ms ease-in-out, color 200ms ease-in-out, background-color 200ms ease-in-out, border-color 200ms ease-in-out, fill 200ms ease-in-out',
})

globalStyle('*:focus-visible', {
  outlineWidth: '2px',
})

globalStyle('button', {
  color: vars.color.textSecondary,
})
