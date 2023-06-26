import { keyframes, style } from '@vanilla-extract/css'

import { vars } from '@/styles/theme.css'

const overlayShow = keyframes({
  from: {
    opacity: 0,
  },
  to: {
    opacity: 1,
  },
})

export const overlay = style({
  background: vars.color.blackA5,
  position: 'fixed',
  inset: 0,
  animation: `${overlayShow} 150ms ${vars.easing.base}`,
})

const contentShow = keyframes({
  from: {
    opacity: 0,
    transform: 'translate(-50%, -48%) scale(0.9)',
  },
  to: {
    opacity: 1,
    transform: 'translate(-50%, -50%) scale(1)',
  },
})

export const content = style({
  background: vars.color.popoverBackground,
  borderRadius: vars.radii.m,
  boxShadow: vars.shadow.xl,
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90vw',
  maxWidth: '500px',
  maxHeight: '85vh',
  padding: '2rem',
  animation: `${contentShow} 150ms ${vars.easing.base}`,
})

export const title = style({
  fontSize: '1.125rem',
  fontWeight: vars.fontWeight.medium,
  marginBottom: '1rem',
})

export const description = style({
  marginBottom: '1.5rem',
  color: vars.color.textSecondary,
})

export const actionsContainer = style({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '1rem',
})
