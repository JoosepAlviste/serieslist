import { style, styleVariants } from '@vanilla-extract/css'

import { vars } from '@/styles/theme.css'

const posterContainerBase = style({
  aspectRatio: '2 / 3',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

export const posterContainer = styleVariants({
  s: [
    posterContainerBase,
    {
      height: '4rem',
    },
  ],
  l: [
    posterContainerBase,
    {
      height: '25rem',
    },
  ],
})

export const poster = style({
  display: 'block',
  maxHeight: '100%',

  selectors: {
    [`${posterContainer.s} &`]: {
      borderRadius: vars.radii.s,
    },
    [`${posterContainer.l} &`]: {
      borderRadius: vars.radii.xl,
    },
  },
})
