import { style } from '@vanilla-extract/css'

import { responsive, vars } from '#/styles/theme.css'

export const container = style({
  display: 'grid',
  gridTemplateColumns: 'auto 1fr auto',
  gridTemplateRows: 'auto auto auto 1fr',
  gap: '1rem 2rem',
  marginTop: '1.5rem',
  marginBottom: '5rem',
  paddingRight: '3rem',

  '@media': {
    [responsive.m]: {
      gridTemplateColumns: 'auto auto auto',
      gridTemplateRows: 'auto auto auto auto 1fr',
      marginTop: '0.5rem',
      paddingLeft: '1rem',
      paddingRight: '1rem',
    },
  },
})

export const poster = style({
  alignItems: 'flex-start',
  gridArea: '1 / 1 / 5 / 2',

  '@media': {
    [responsive.m]: {
      gridArea: '4 / 1 / 5 / 2',
      width: '100%',
      height: 'auto',
    },
  },
})

export const titleContainer = style({
  gridArea: '1 / 2 / 2 / 3',
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',

  '@media': {
    [responsive.m]: {
      gridArea: '1 / 1 / 2 / 4',
      marginBottom: '-1rem',
    },
  },
})

export const imdbLogo = style({
  height: '2rem',
  width: '2rem',
  minWidth: '2rem',
})

export const statusSelectContainer = style({
  alignSelf: 'center',

  '@media': {
    [responsive.m]: {
      gridArea: '3 / 1 / 4 / 4',
    },
  },
})

export const years = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  gridArea: '2 / 2 / 3 / 4',

  '@media': {
    [responsive.m]: {
      gridArea: '2 / 1 / 3 / 4',
    },
  },
})

export const descriptionContainer = style({
  gridArea: '3 / 2 / 4 / 4',
  maxWidth: '70ch',

  '@media': {
    [responsive.m]: {
      gridArea: '4 / 2 / 5 / 4',
    },
  },
})

export const description = style({
  '@media': {
    [responsive.m]: {
      WebkitLineClamp: 5,
      display: '-webkit-box',
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  },
})

export const seasons = style({
  gridArea: '4 / 2 / 5 / 4',

  '@media': {
    [responsive.m]: {
      gridArea: '5 / 1 / 5 / 4',
    },
  },
})

export const seasonsTitle = style({
  marginBottom: '1rem',
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

export const nextEpisode = style({
  alignSelf: 'flex-start',
  background: vars.color.pillBackground,
  color: vars.color.pillText,
  borderRadius: vars.radii.s,
  padding: '0.5rem 1rem',
  textAlign: 'center',

  '@media': {
    [responsive.m]: {
      alignSelf: 'stretch',
    },
  },
})

export const nextEpisodeTitle = style({
  color: vars.color.pillText,
  fontWeight: vars.fontWeight.medium,
})

export const episodesTitleRow = style({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '1rem',
  paddingRight: '1rem',
})

export const episodesTitle = style({
  flex: 1,
})
