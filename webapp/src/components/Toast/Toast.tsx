import * as BaseToast from '@radix-ui/react-toast'
import classNames from 'classnames'
import React from 'react'

import { Icon } from '../Icon'
import { IconButton } from '../IconButton'

import * as s from './Toast.css'

export type ToastVariant = keyof typeof s.toastVariant

type ToastProps = {
  title: string
  isOpen: boolean
  variant?: ToastVariant
  onOpenChange: (isOpen: boolean) => void
}

export const Toast = ({
  isOpen,
  onOpenChange,
  title,
  variant = 'success',
}: ToastProps) => (
  <BaseToast.Root
    open={isOpen}
    onOpenChange={onOpenChange}
    className={classNames(s.root, s.toastVariant[variant])}
  >
    <div className={s.iconContainer}>
      <Icon name="check" aria-hidden />
    </div>
    <BaseToast.Title className={s.title}>{title}</BaseToast.Title>
    <BaseToast.Close asChild>
      <IconButton name="cross" label="Close" />
    </BaseToast.Close>
  </BaseToast.Root>
)
