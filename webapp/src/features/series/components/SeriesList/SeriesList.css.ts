import { style } from '@vanilla-extract/css'

import { responsive, vars } from '@/styles/theme.css'

export const container = style({
  background: vars.color.popoverBackground,
  boxShadow: vars.shadow.xl,
  borderRadius: vars.radii.m,
  overflow: 'hidden',

  '@media': {
    [responsive.m]: {
      borderRadius: 0,
    },
  },
})

export const table = style({
  width: '100%',
  textAlign: 'left',
})

export const tableHead = style({
  backgroundColor: vars.color.popoverHoverBackground,
  color: vars.color.textTertiary,
  fontWeight: vars.fontWeight.bold,
  fontVariant: 'all-small-caps',
})

export const tableHeadCellPoster = style({
  minWidth: '4.75rem',
  width: 0,
})

export const tableHeadCell = style({
  padding: '0.5rem 1rem',
  whiteSpace: 'nowrap',
})

export const lastRowNextEpisodeAvailable = style({})

export const cell = style({
  padding: '1rem',
  verticalAlign: 'middle',
  borderBottomColor: vars.color.separator,
  borderBottomStyle: 'solid',

  selectors: {
    [`tr:not(${lastRowNextEpisodeAvailable}):not(:last-of-type) &`]: {
      borderBottomWidth: 1,
    },
  },
})

export const cellSubheading = style([
  tableHead,
  {
    selectors: {
      [`tr:not(${lastRowNextEpisodeAvailable}):not(:last-of-type) &`]: {
        borderBottomWidth: 0,
      },
    },
  },
])

export const cellPoster = style({
  width: 1,
})

export const loadingContainer = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '3rem',
})

export const emptyListContainer = style({
  padding: '3rem',
})

export const emptyListIllustration = style({
  height: 150,
  width: '100%',
  marginBottom: '2rem',
})

export const emptyListText = style({
  textAlign: 'center',
  color: vars.color.textTertiary,
  fontWeight: vars.fontWeight.medium,
})
