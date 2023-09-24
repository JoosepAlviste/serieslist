import { style } from '@vanilla-extract/css'

import { zIndex } from '#/styles/theme.css'

export const viewport = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  position: 'fixed',
  bottom: 0,
  left: 0,
  padding: '2rem',
  margin: 0,
  width: '30rem',
  maxWidth: '100vw',
  listStyle: 'none',
  outline: 'none',
  zIndex: zIndex.layout.toast,
})
