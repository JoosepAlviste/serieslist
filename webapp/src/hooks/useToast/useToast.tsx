import {
  ToastProvider as BaseToastProvider,
  Viewport,
} from '@radix-ui/react-toast'
import React, {
  createContext,
  useContext,
  useState,
  type ReactElement,
} from 'react'

import { Toast as ToastComponent } from '@/components'

import * as s from './useToast.css'

type Toast = {
  id: string
  title: string
}

type ToastInternal = Toast & {
  isOpen: boolean
}

const ToastContext = createContext<{
  toasts: Toast[]
  showToast: (toast: Toast) => void
}>({
  toasts: [],
  showToast: () => undefined,
})

type ToastProviderProps = {
  children: ReactElement
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<ToastInternal[]>([])

  const showToast = (toast: Toast) => {
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

export const useToast = () => {
  return useContext(ToastContext)
}
