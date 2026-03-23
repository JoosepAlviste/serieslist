import classNames from 'classnames'
import React, { forwardRef, type ComponentPropsWithoutRef } from 'react'

import { useSSR } from '../../hooks'
import type { IconName, IconProps } from '../Icon'
import { Icon } from '../Icon'
import { Tooltip } from '../Tooltip'

import * as s from './IconButton.css'

export type IconButtonProps = ComponentPropsWithoutRef<'button'> & {
  name: IconName
  label: string
  variant?: keyof typeof s.variant
  size?: 'm' | 's'
}

const getIconSize = (
  buttonSize: NonNullable<IconButtonProps['size']>,
): IconProps['size'] => {
  return (
    {
      m: 'm',
      s: 's',
    } as const
  )[buttonSize]
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    {
      name,
      label,
      variant = 'default',
      className,
      disabled = false,
      size = 'm',
      ...rest
    },
    ref,
  ) {
    const { isSSR } = useSSR()

    return (
      <Tooltip text={label} side="top">
        <button
          ref={ref}
          type="button"
          className={classNames(
            s.button,
            s.variant[variant],
            s.size[size],
            className,
          )}
          disabled={disabled || isSSR}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          autoComplete="off"
          {...rest}
        >
          <Icon name={name} label={label} size={getIconSize(size)} />
        </button>
      </Tooltip>
    )
  },
)
