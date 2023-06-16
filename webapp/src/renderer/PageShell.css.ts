import { style } from '@vanilla-extract/css'

export const pageContainer = style({
  display: 'grid',
  gridTemplateRows: 'min-content auto',
  gridTemplateColumns: 'min-content auto',
  height: '100vh',
})

export const header = style({
  gridArea: '1 / 2 / 2 / 3',
})

export const nav = style({
  gridArea: '1 / 1 / 3 / 2',
})

export const main = style({
  gridArea: '2 / 2 / 3 / 3',
  overflow: 'auto',
})
