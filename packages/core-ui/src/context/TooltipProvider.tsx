import { TooltipProvider as BaseTooltipProvider } from '@radix-ui/react-tooltip'
import type { ReactNode } from 'react'
import React from 'react'

type TooltipProviderProps = {
  children: ReactNode
}

export const TooltipProvider = ({ children }: TooltipProviderProps) => {
  return (
    <BaseTooltipProvider delayDuration={400}>{children}</BaseTooltipProvider>
  )
}
