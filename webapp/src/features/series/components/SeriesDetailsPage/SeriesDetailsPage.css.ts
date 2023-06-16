import { style } from '@vanilla-extract/css'

import { vars } from '@/styles/theme.css'

export const container = style({
  display: 'flex',
  gap: '2rem',
  marginTop: '1.5rem',
  marginBottom: '1.5rem',
  paddingRight: '3rem',
})

export const poster = style({
  alignItems: 'flex-start',
})

export const titleLine = style({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '0.25rem',
})

export const titleContainer = style({
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  flex: 1,
})

export const title = style({
  fontSize: '2rem',
  fontWeight: vars.fontWeight.medium,
})

export const imdbLogo = style({
  height: '2rem',
  width: '2rem',
})

export const years = style({
  fontSize: '0.875rem',
  marginBottom: '0.75rem',
  color: vars.color.textTertiary,
})

export const description = style({
  maxWidth: '70ch',
  marginBottom: '2rem',
  color: vars.color.textSecondary,
})

export const seasons = style({
  marginBottom: '2rem',
})

export const seasonsTitle = style({
  marginBottom: '1rem',
  fontSize: '1.375rem',
  fontWeight: vars.fontWeight.medium,
})

export const seasonTabsContainer = style({
  display: 'flex',
  marginBottom: '2rem',
})

export const seasonTabs = style({
  borderRadius: vars.radii.s,
  overflow: 'hidden',
})

export const seasonTrigger = style({
  paddingTop: '0.5rem',
  paddingRight: '0.75rem',
  paddingBottom: 'calc(0.5rem - 2px)',
  paddingLeft: '0.75rem',
  color: vars.color.textSecondary,
  background: vars.color.inputSecondaryBackground,
  borderBottomWidth: 2,
  borderBottomStyle: 'solid',
  borderBottomColor: vars.color.inputSecondaryBackground,

  ':hover': {
    background: vars.color.inputRaisedBackground,
    borderBottomColor: vars.color.inputRaisedBackground,
  },

  ':focus': {
    background: vars.color.inputRaisedBackground,
    borderBottomColor: vars.color.inputRaisedBackground,
    outline: 'none',
  },

  selectors: {
    '&[data-state="active"]': {
      color: vars.color.primary,
      borderBottomColor: vars.color.primary,
    },
  },
})

export const episodesContainer = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
})

export const episodesTitleRow = style({
  display: 'flex',
  marginBottom: '0.5rem',
  paddingRight: '1rem',
})

export const episodesTitle = style({
  flex: 1,
  fontSize: '1rem',
  fontWeight: vars.fontWeight.medium,
  marginBottom: '0.5rem',
})
