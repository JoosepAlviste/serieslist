import classNames from 'classnames'
import React, { type ComponentPropsWithoutRef } from 'react'

import { Text } from '../Text'

import * as s from './Error.css'

type ErrorProps = ComponentPropsWithoutRef<'div'>

export const Error = ({ className, ...rest }: ErrorProps) => {
  return <Text size="s" className={classNames(s.error, className)} {...rest} />
}
