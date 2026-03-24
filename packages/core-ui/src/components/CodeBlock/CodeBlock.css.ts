import { style } from '@vanilla-extract/css'

import { vars } from '../../theme.css'

export const code = style({
  display: 'block',
  position: 'relative',
  paddingTop: '1.5rem',
  paddingBottom: '1.5rem',
  paddingLeft: '2rem',
  paddingRight: '2rem',
  background: vars.color.codeBackground,
  borderRadius: vars.radii.s,
})

export const pre = style({
  fontFamily: 'monospace',
})

export const copyButton = style({
  position: 'absolute',
  top: '1rem',
  right: '1rem',
})
