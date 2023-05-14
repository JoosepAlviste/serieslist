import { globalStyle } from '@vanilla-extract/css'

import { vars } from '@/styles/theme.css'

globalStyle('body', {
  fontFamily: 'Inter, sans-serif',
  color: vars.color.slate900,
})

globalStyle('*', {
  outlineWidth: 0,
  outlineStyle: 'solid',
  outlineColor: vars.color.indigo500,
  transition: 'outline-width 100ms ease-in-out',
})

globalStyle('*:focus-visible', {
  outlineWidth: '2px',
})
