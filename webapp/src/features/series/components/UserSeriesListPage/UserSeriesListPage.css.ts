import { style } from '@vanilla-extract/css'

import { responsive, vars } from '@/styles/theme.css'

export const container = style({
  marginTop: '1.5rem',
  marginLeft: '5rem',
  marginRight: '5rem',
  marginBottom: '5rem',

  '@media': {
    [responsive.l]: {
      marginLeft: '1rem',
      marginRight: '1rem',
    },

    [responsive.m]: {
      marginLeft: 0,
      marginRight: 0,
    },
  },
})

export const tabs = style({
  display: 'flex',
  background: vars.color.inputSecondaryBackground,
  borderRadius: vars.radii.m,
  marginBottom: '2rem',
  whiteSpace: 'nowrap',
  overflowX: 'auto',

  '@media': {
    [responsive.m]: {
      borderRadius: 0,
      marginBottom: 0,
      paddingLeft: '1rem',
      paddingRight: '1rem',
    },
  },
})

export const tab = style({
  flex: 1,
  padding: '0.75rem',
  borderColor: vars.color.inputSecondaryBackground,
  borderStyle: 'solid',
  borderTopWidth: 0,
  borderLeftWidth: 0,
  borderRightWidth: 0,
  borderBottomWidth: 3,

  ':hover': {
    background: vars.color.inputRaisedBackground,
    borderBottomColor: vars.color.inputRaisedBackground,
  },

  selectors: {
    '&[data-state="active"]': {
      color: vars.color.primary,
      borderColor: vars.color.primary,
      fontWeight: vars.fontWeight.medium,
    },
  },
})
