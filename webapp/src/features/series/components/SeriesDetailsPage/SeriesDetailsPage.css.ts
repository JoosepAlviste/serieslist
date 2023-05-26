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

export const titleContainer = style({
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
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
  marginBottom: '1rem',
  color: vars.color.slate500,
})

export const description = style({
  maxWidth: '70ch',
  marginBottom: '2rem',
  color: vars.color.slate700,
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
  marginBottom: '1rem',
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
  color: vars.color.slate700,
  background: vars.color.slate100,
  borderBottomWidth: 2,
  borderBottomStyle: 'solid',
  borderBottomColor: vars.color.slate100,

  ':hover': {
    background: vars.color.slate200,
    borderBottomColor: vars.color.slate200,
  },

  selectors: {
    '&[data-state="active"]': {
      color: vars.color.indigo500,
      borderBottomColor: vars.color.indigo500,
    },
  },
})

export const episodesContainer = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
})

export const episodesTitle = style({
  fontSize: '1rem',
  fontWeight: vars.fontWeight.medium,
  marginBottom: '0.5rem',
})

export const episode = style({
  display: 'flex',
  gap: '0.5rem',
  background: vars.color.slate100,
  color: vars.color.slate700,
  borderRadius: vars.radii.s,
  paddingTop: '0.5rem',
  paddingRight: '1rem',
  paddingBottom: '0.5rem',
  paddingLeft: '1rem',
})

export const episodeNumber = style({
  fontWeight: vars.fontWeight.bold,
})
