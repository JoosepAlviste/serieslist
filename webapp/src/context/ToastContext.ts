import { createContext } from 'react'

export type Toast = {
  id: string
  title: string
}

export const ToastContext = createContext<{
  toasts: Toast[]
  showToast: (toast: Toast) => void
}>({
  toasts: [],
  showToast: () => undefined,
})
