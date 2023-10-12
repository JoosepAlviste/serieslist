import { style } from '@vanilla-extract/css'

import { responsive, vars } from '#/styles/theme.css'

export const episode = style({
  display: 'grid',
  gridTemplateColumns: 'auto 1fr auto',
  gridTemplateRows: 'auto',
  alignItems: 'center',
  gap: '0.5rem',
  background: vars.color.inputSecondaryBackground,
  borderRadius: vars.radii.s,
  paddingTop: '0.5rem',
  paddingRight: '1rem',
  paddingBottom: '0.5rem',
  paddingLeft: '1rem',

  '@media': {
    [responsive.m]: {
      gridTemplateColumns: '1fr auto',
      gridTemplateRows: 'auto auto',
    },
  },
})

export const episodeTitle = style({
  '@media': {
    [responsive.m]: {
      gridArea: '2 / 1 / 3 / 3',
    },
  },
})
