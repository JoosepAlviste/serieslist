import * as BaseToast from '@radix-ui/react-toast'
import React from 'react'

import { Icon } from '../Icon'
import { IconButton } from '../IconButton'

import * as s from './Toast.css'

type ToastProps = {
  title: string
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

export const Toast = ({ isOpen, onOpenChange, title }: ToastProps) => (
  <BaseToast.Root open={isOpen} onOpenChange={onOpenChange} className={s.root}>
    <div className={s.iconContainer}>
      <Icon name="check" aria-hidden />
    </div>
    <BaseToast.Title className={s.title}>{title}</BaseToast.Title>
    <BaseToast.Close asChild>
      <IconButton name="cross" label="Close" />
    </BaseToast.Close>
  </BaseToast.Root>
)
