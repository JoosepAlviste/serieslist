import { AccessibleIcon } from '@radix-ui/react-accessible-icon'
import classNames from 'classnames'
import React, { type SVGAttributes } from 'react'

import { icons } from '../../generated/icons'

import * as s from './Icon.css'

export type IconName = keyof typeof icons

type BaseIconProps = SVGAttributes<SVGElement> & {
  name: IconName
  size?: keyof typeof s.iconSize
}

type IconProps = BaseIconProps &
  (
    | {
        label: string
      }
    | {
        'aria-hidden': true
        label?: never
      }
  )

/**
 * Use the `iconColorVar` CSS variable to customize the color of the icon. When
 * adding new icons, change the colors in the SVG to `currentColor`, which will
 * be replaced with a CSS variable by SVGR.
 */
export const Icon = ({
  name,
  label,
  size = 'm',
  className,
  ...rest
}: IconProps) => {
  const Component = icons[name]

  if (label) {
    return (
      <AccessibleIcon label={label}>
        <Component
          className={classNames(s.icon, s.iconSize[size], className)}
          {...rest}
        />
      </AccessibleIcon>
    )
  }

  return <Component className={classNames(s.icon, className)} {...rest} />
}
