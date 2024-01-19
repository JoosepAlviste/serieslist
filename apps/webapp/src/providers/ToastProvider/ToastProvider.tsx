import {
  ToastProvider as BaseToastProvider,
  Viewport,
} from '@radix-ui/react-toast'
import { Toast as ToastComponent } from '@serieslist/ui'
import React, { useRef, useState, type ReactElement } from 'react'

import { type Toast, ToastContext } from '#/context'

import * as s from './ToastProvider.css'

type ToastInternal = Toast & {
  isOpen: boolean
}

type ToastProviderProps = {
  children: ReactElement
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<ToastInternal[]>([])

  const showToast = (toast: Toast) => {
    window.clearTimeout(clearTimerRef.current)

    const existingToast = toasts.find((t) => t.id === toast.id)
    if (existingToast) {
      updateToast(toast.id, { isOpen: false })
      setTimeout(() => {
        updateToast(toast.id, { ...toast, isOpen: true })
      }, 100)
    } else {
      setToasts([
        ...toasts,
        {
          ...toast,
          isOpen: true,
        },
      ])
    }
  }

  const showErrorToast = (toast?: Partial<Toast>) => {
    showToast({
      variant: 'error',
      id: 'something_went_wrong',
      title: 'Something went wrong',
      ...toast,
    })
  }

  const clearTimerRef = useRef(0)

  const updateToast = (
    toastId: string,
    updatedToast: Partial<ToastInternal>,
  ) => {
    setToasts(
      toasts.map((toast) => {
        if (toast.id === toastId) {
          return {
            ...toast,
            ...updatedToast,
          }
        } else {
          return toast
        }
      }),
    )

    if (!updatedToast.isOpen) {
      window.clearTimeout(clearTimerRef.current)
      clearTimerRef.current = window.setTimeout(() => {
        setToasts((toasts) => {
          return toasts.filter(
            (toast) => !(toast.id === toastId && !toast.isOpen),
          )
        })
      }, 1000)
    }
  }

  return (
    <BaseToastProvider swipeDirection="left">
      <ToastContext.Provider
        value={{
          toasts,
          showToast,
          showErrorToast,
        }}
      >
        {children}

        {toasts.map((toast) => (
          <ToastComponent
            key={toast.id}
            isOpen={toast.isOpen}
            variant={toast.variant}
            title={toast.title}
            onOpenChange={(isOpen) => updateToast(toast.id, { isOpen })}
          />
        ))}
      </ToastContext.Provider>

      <Viewport className={s.viewport} />
    </BaseToastProvider>
  )
}
