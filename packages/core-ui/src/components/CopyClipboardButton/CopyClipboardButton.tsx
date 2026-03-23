import { useCopyToClipboard } from '@uidotdev/usehooks'
import type { MouseEventHandler } from 'react'
import React from 'react'

import { useAutoReset } from '../../hooks'
import type { IconButtonProps } from '../IconButton'
import { IconButton } from '../IconButton'

type CopyClipboardButtonProps = Omit<
  IconButtonProps,
  'onClick' | 'name' | 'label'
> & {
  text: string
}

export const CopyClipboardButton = ({
  text,
  ...rest
}: CopyClipboardButtonProps) => {
  const [isCopied, setIsCopied] = useAutoReset(false, 2000)
  const [, copyToClipboard] = useCopyToClipboard()

  const copyToken: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.stopPropagation()
    e.preventDefault()

    if (text) {
      await copyToClipboard(text)
      setIsCopied(true)
    }
  }

  return (
    <IconButton
      onClick={copyToken}
      name={isCopied ? 'check' : 'copy'}
      label={isCopied ? 'Copied!' : 'Copy to clipboard'}
      {...rest}
    />
  )
}
