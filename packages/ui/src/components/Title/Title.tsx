import classNames from 'classnames'
import React, { type HTMLAttributes } from 'react'

import * as s from './Title.css'

type TitleProps = HTMLAttributes<HTMLHeadingElement> & {
  as?: 'h1' | 'h2' | 'h3'
  size?: keyof typeof s.titleSize
  variant?: keyof typeof s.titleVariant
}

export const Title = ({
  as: Component = 'h1',
  size = 'm',
  variant = 'default',
  className,
  ...rest
}: TitleProps) => (
  <Component
    className={classNames(
      s.title,
      s.titleSize[size],
      s.titleVariant[variant],
      className,
    )}
    {...rest}
  />
)
