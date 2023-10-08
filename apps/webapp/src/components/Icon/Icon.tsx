import { AccessibleIcon } from '@radix-ui/react-accessible-icon'
import classNames from 'classnames'
import React, { type SVGAttributes } from 'react'

import AboutIcon from './About.svg?react'
import CheckIcon from './Check.svg?react'
import CrossIcon from './Cross.svg?react'
import GitHubIcon from './GitHub.svg?react'
import * as s from './Icon.css'
import LogoIcon from './Logo.svg?react'
import PlusIcon from './Plus.svg?react'
import SearchIcon from './Search.svg?react'
import SeriesIcon from './Series.svg?react'
import TriangleIcon from './Triangle.svg?react'
import UserIcon from './User.svg?react'

const icons = {
  logo: LogoIcon,
  series: SeriesIcon,
  triangle: TriangleIcon,
  user: UserIcon,
  search: SearchIcon,
  cross: CrossIcon,
  check: CheckIcon,
  plus: PlusIcon,
  github: GitHubIcon,
  about: AboutIcon,
}

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
