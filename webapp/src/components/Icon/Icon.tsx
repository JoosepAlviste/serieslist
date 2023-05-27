import { AccessibleIcon } from '@radix-ui/react-accessible-icon'
import classNames from 'classnames'
import React, { type SVGAttributes } from 'react'

import { ReactComponent as CheckIcon } from './Check.svg'
import { ReactComponent as CrossIcon } from './Cross.svg'
import * as s from './Icon.css'
import { ReactComponent as LogoIcon } from './Logo.svg'
import { ReactComponent as SearchIcon } from './Search.svg'
import { ReactComponent as SeriesIcon } from './Series.svg'
import { ReactComponent as TriangleIcon } from './Triangle.svg'
import { ReactComponent as UserIcon } from './User.svg'

const icons = {
  logo: LogoIcon,
  series: SeriesIcon,
  triangle: TriangleIcon,
  user: UserIcon,
  search: SearchIcon,
  cross: CrossIcon,
  check: CheckIcon,
}

type BaseIconProps = SVGAttributes<SVGElement> & {
  name: keyof typeof icons
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
