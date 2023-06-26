import { style } from '@vanilla-extract/css'

import { responsive } from '@/styles/theme.css'

export const pageContainer = style({
  display: 'grid',
  gridTemplateRows: 'min-content 1fr',
  gridTemplateColumns: 'min-content 1fr',
  height: '100vh',
})

export const header = style({
  gridArea: '1 / 2 / 2 / 3',
})

export const nav = style({
  gridArea: '1 / 1 / 3 / 2',

  '@media': {
    [responsive.m]: {
      display: 'none',
    },
  },
})

export const main = style({
  gridArea: '2 / 2 / 3 / 3',
  overflow: 'auto',
})
