import { keyframes, style, styleVariants } from '@vanilla-extract/css'

import { iconColorVar } from '@/styles/cssVariables'
import { vars } from '@/styles/theme.css'

const slideIn = keyframes({
  from: {
    transform: 'translateX(-100%)',
  },

  to: {
    transform: 'translateX(0)',
  },
})

const hide = keyframes({
  from: {
    opacity: 1,
  },

  to: {
    opacity: 0,
  },
})

const swipeOut = keyframes({
  from: {
    transform: 'translateX(var(--radix-toast-swipe-end-x))',
  },

  to: {
    transform: 'translateX(-100%)',
  },
})

export const root = style({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  background: vars.color.popoverBackground,
  fontWeight: vars.fontWeight.medium,
  boxShadow: vars.shadow['2xl'],
  borderRadius: vars.radii.m,
  padding: '2rem 2rem 2rem 2rem',
  overflow: 'hidden',

  vars: {
    [vars.color.inputSecondaryBackground]: vars.color.inputRaisedBackground,
  },

  '::before': {
    display: 'block',
    content: '',
    width: '0.5rem',
    height: '100%',
    left: 0,
    position: 'absolute',
  },

  selectors: {
    '&[data-state="open"]': {
      animation: `${slideIn} 150ms ease-in-out`,
    },

    '&[data-state="closed"]': {
      animation: `${hide} 100ms ease-in`,
    },

    '&[data-swipe="move"]': {
      transform: 'translateX(var(--radix-toast-swipe-move-x))',
    },

    '&[data-swipe="cancel"]': {
      transform: 'translateX(0)',
      transition: 'transform 200ms ease-out',
    },

    '&[data-swipe="end"]': {
      animation: `${swipeOut} 100ms ease-out`,
    },
  },
})

export const toastVariant = styleVariants({
  success: {
    color: vars.color.textSuccess,

    '::before': {
      backgroundColor: vars.color.toastSuccessAccessory,
    },
  },

  error: {
    color: vars.color.textError,

    '::before': {
      backgroundColor: vars.color.toastErrorAccessory,
    },
  },
})

export const iconContainer = style({
  borderRadius: '50%',
  padding: '0.5rem',

  selectors: {
    [`${toastVariant.success} &`]: {
      vars: {
        [iconColorVar]: vars.color.textSuccess,
      },

      background: vars.color.toastSuccessAccessory,
    },
    [`${toastVariant.error} &`]: {
      vars: {
        [iconColorVar]: vars.color.textError,
      },

      background: vars.color.toastErrorAccessory,
    },
  },
})

export const title = style({
  flex: 1,
})
