import * as BaseTooltip from '@radix-ui/react-tooltip'
import React, { type ReactElement } from 'react'

import * as s from './Tooltip.css'

type TooltipProps = {
  text: string
  children: ReactElement
  side?: BaseTooltip.TooltipContentProps['side']
}

export const Tooltip = ({ text, side, children }: TooltipProps) => {
  return (
    <BaseTooltip.Root>
      <BaseTooltip.Trigger asChild>{children}</BaseTooltip.Trigger>

      <BaseTooltip.Portal>
        <BaseTooltip.Content className={s.content} side={side} sideOffset={4}>
          {text}
          <BaseTooltip.Arrow className={s.arrow} />
        </BaseTooltip.Content>
      </BaseTooltip.Portal>
    </BaseTooltip.Root>
  )
}
