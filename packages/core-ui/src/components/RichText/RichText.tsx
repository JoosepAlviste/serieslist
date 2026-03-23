import classNames from 'classnames'
import type { HTMLAttributes } from 'react'
import React from 'react'

import * as s from './RichText.css'

type RichTextProps = HTMLAttributes<HTMLDivElement>

export const RichText = ({ className, ...rest }: RichTextProps) => {
  return <div className={classNames(s.richText, className)} {...rest} />
}
