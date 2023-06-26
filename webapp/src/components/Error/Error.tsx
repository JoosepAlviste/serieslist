import classNames from 'classnames'
import React, { type ComponentPropsWithoutRef } from 'react'

import * as s from './Error.css'

type ErrorProps = ComponentPropsWithoutRef<'div'>

export const Error = ({ className, ...rest }: ErrorProps) => {
  return <div className={classNames(s.error, className)} {...rest} />
}
