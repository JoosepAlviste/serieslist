import {
  ToastProvider as BaseToastProvider,
  Viewport,
} from '@radix-ui/react-toast'
import React, { useRef, useState, type ReactElement } from 'react'

import { Toast as ToastComponent } from '@/components'
import { type Toast, ToastContext } from '@/context'

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
      setIsToastOpen(toast.id, false)
      setTimeout(() => {
        setIsToastOpen(toast.id, true)
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

  const clearTimerRef = useRef(0)

  const setIsToastOpen = (toastId: string, isOpen: boolean) => {
    setToasts(
      toasts.map((toast) => {
        if (toast.id === toastId) {
          return {
            ...toast,
            isOpen,
          }
        } else {
          return toast
        }
      }),
    )

    if (!isOpen) {
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
    <BaseToastProvider>
      <ToastContext.Provider
        value={{
          toasts,
          showToast,
        }}
      >
        {children}

        {toasts.map((toast) => (
          <ToastComponent
            key={toast.id}
            isOpen={toast.isOpen}
            title={toast.title}
            onOpenChange={(isOpen) => setIsToastOpen(toast.id, isOpen)}
          />
        ))}
      </ToastContext.Provider>

      <Viewport className={s.viewport} />
    </BaseToastProvider>
  )
}
