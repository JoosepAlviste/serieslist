import type { ToastVariant } from '@serieslist/ui'
import { createContext } from 'react'

export type Toast = {
  id: string
  title: string
  variant?: ToastVariant
}

export const ToastContext = createContext<{
  toasts: Toast[]
  showToast: (toast: Toast) => void
  showErrorToast: (toast?: Partial<Toast>) => void
}>({
  toasts: [],
  showToast: () => undefined,
  showErrorToast: () => undefined,
})
