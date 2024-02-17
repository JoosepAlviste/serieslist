import { style } from '@vanilla-extract/css'

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: '5rem',
  paddingLeft: '1rem',
  paddingRight: '1rem',
  textAlign: 'center',
})

export const illustration = style({
  width: '100%',
  maxWidth: '25rem',
  height: 'auto',
  aspectRatio: '5 / 3',
  marginBottom: '4rem',
})

export const title = style({
  marginBottom: '1rem',
})
