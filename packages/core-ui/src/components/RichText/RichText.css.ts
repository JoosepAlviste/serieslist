import { globalStyle, style } from '@vanilla-extract/css'

export const richText = style({})

globalStyle(`${richText} p`, {
  marginBottom: '1rem',
})

globalStyle(`${richText} ol`, {
  marginLeft: '1.5rem',
  listStyleType: 'decimal',
})

globalStyle(`${richText} ul`, {
  marginLeft: '1.5rem',
  listStyleType: 'disc',
})

globalStyle(`${richText} code`, {
  fontFamily: 'monospace',
})
