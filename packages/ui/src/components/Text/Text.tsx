import classNames from 'classnames'
import React, { type HTMLAttributes } from 'react'

import * as s from './Text.css'

type TextProps = HTMLAttributes<HTMLDivElement> & {
  as?: 'div' | 'span' | 'p'
  size?: keyof typeof s.textSize
  variant?: keyof typeof s.textVariant
  weight?: keyof typeof s.textWeight
}

export const Text = ({
  as: Component = 'div',
  size = 'm',
  variant = 'default',
  weight = 'regular',
  className,
  ...rest
}: TextProps) => (
  <Component
    className={classNames(
      s.textWeight[weight],
      s.textSize[size],
      s.textVariant[variant],
      className,
    )}
    {...rest}
  />
)
