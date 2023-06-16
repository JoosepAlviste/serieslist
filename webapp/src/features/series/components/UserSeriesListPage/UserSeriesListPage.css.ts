import { style } from '@vanilla-extract/css'

import { vars } from '@/styles/theme.css'

export const container = style({
  marginTop: '1.5rem',
  marginLeft: '5rem',
  marginRight: '5rem',
})

export const tabs = style({
  display: 'flex',
  background: vars.color.inputSecondaryBackground,
  borderRadius: vars.radii.m,
  marginBottom: '2rem',
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

  ':first-of-type': {
    borderTopLeftRadius: vars.radii.m,
    borderBottomLeftRadius: vars.radii.m,
  },

  ':last-of-type': {
    borderTopRightRadius: vars.radii.m,
    borderBottomRightRadius: vars.radii.m,
  },

  selectors: {
    '&[data-state="active"]': {
      color: vars.color.primary,
      borderColor: vars.color.primary,
      fontWeight: vars.fontWeight.medium,
    },
  },
})
