import classNames from 'classnames'
import React, { forwardRef, type ComponentPropsWithoutRef } from 'react'

import { type IconName } from '../Icon'
import { Icon } from '../Icon'

import * as s from './IconButton.css'

type IconButtonProps = ComponentPropsWithoutRef<'button'> & {
  name: IconName
  label: string
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton({ name, label, className, ...rest }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        className={classNames(s.button, className)}
        {...rest}
      >
        <Icon name={name} label={label} />
      </button>
    )
  },
)
