import * as AlertDialogRadix from '@radix-ui/react-alert-dialog'
import React, { type ReactElement } from 'react'

import { Text } from '../Text'

import * as s from './AlertDialog.css'

type AlertDialogProps = {
  title: string
  description: string
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  actions: ReactElement
  /**
   * The trigger element, should accept a ref.
   */
  children: ReactElement
}

const AlertDialogDialog = ({
  title,
  description,
  children,
  actions,
  isOpen,
  onOpenChange,
}: AlertDialogProps) => (
  <AlertDialogRadix.Root open={isOpen} onOpenChange={onOpenChange}>
    <AlertDialogRadix.Trigger asChild>{children}</AlertDialogRadix.Trigger>

    <AlertDialogRadix.Portal>
      <AlertDialogRadix.Overlay className={s.overlay} />

      <AlertDialogRadix.Content className={s.content}>
        <AlertDialogRadix.Title className={s.title}>
          <Text size="l" weight="medium">
            {title}
          </Text>
        </AlertDialogRadix.Title>
        <AlertDialogRadix.Description className={s.description} asChild>
          <Text as="p" variant="secondary">
            {description}
          </Text>
        </AlertDialogRadix.Description>

        <div className={s.actionsContainer}>{actions}</div>
      </AlertDialogRadix.Content>
    </AlertDialogRadix.Portal>
  </AlertDialogRadix.Root>
)

type AlertDialog = {
  Dialog: typeof AlertDialogDialog
  Cancel: typeof AlertDialogRadix.Cancel
  Action: typeof AlertDialogRadix.Action
}

export const AlertDialog = {
  Dialog: AlertDialogDialog,
  Cancel: AlertDialogRadix.Cancel,
  Action: AlertDialogRadix.Action,
} as AlertDialog
