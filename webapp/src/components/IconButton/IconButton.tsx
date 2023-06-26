import classNames from 'classnames'
import React, { forwardRef, type ComponentPropsWithoutRef } from 'react'

import { type IconName } from '../Icon'
import { Icon } from '../Icon'

import * as s from './IconButton.css'

type IconButtonProps = ComponentPropsWithoutRef<'button'> & {
  name: IconName
  label: string
  variant?: keyof typeof s.variant
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    { name, label, variant = 'default', className, ...rest },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type="button"
        className={classNames(s.button, s.variant[variant], className)}
        {...rest}
      >
        <Icon name={name} label={label} />
      </button>
    )
  },
)
