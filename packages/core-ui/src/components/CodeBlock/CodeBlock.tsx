import React from 'react'

import { CopyClipboardButton } from '../CopyClipboardButton'

import * as s from './CodeBlock.css'

type CodeBlockProps = {
  children: string
}

export const CodeBlock = ({ children }: CodeBlockProps) => {
  return (
    <code className={s.code}>
      <CopyClipboardButton text={children} className={s.copyButton} />

      <pre className={s.pre}>{children}</pre>
    </code>
  )
}
