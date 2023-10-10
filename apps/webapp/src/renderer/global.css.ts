import { globalStyle } from '@vanilla-extract/css'

import { SVG_COLOR_VAR } from '#/styles/simpleCssVariables'
import { colorTransition, vars } from '#/styles/theme.css'

globalStyle(':root', {
  vars: {
    [SVG_COLOR_VAR]: vars.color.icon,
  },
})

globalStyle('body', {
  fontFamily: 'Inter, sans-serif',
  background: vars.color.pageBackground,
})

globalStyle('*', {
  color: vars.color.text,
  outlineWidth: 0,
  outlineStyle: 'solid',
  outlineColor: vars.color.primary,
  transition: `outline-width 100ms ease-in-out, ${colorTransition}, background-color 200ms ease-in-out, border-color 200ms ease-in-out, fill 200ms ease-in-out`,
})

globalStyle('*:focus-visible', {
  outlineWidth: '2px',
})

globalStyle('button', {
  color: vars.color.textSecondary,
})
