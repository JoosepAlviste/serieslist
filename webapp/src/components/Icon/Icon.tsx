import React, { type SVGAttributes } from 'react'

import { ReactComponent as LogoIcon } from './Logo.svg'
import { ReactComponent as SeriesIcon } from './Series.svg'
import { ReactComponent as TriangleIcon } from './Triangle.svg'
import { ReactComponent as UserIcon } from './User.svg'

const icons = {
  logo: LogoIcon,
  series: SeriesIcon,
  triangle: TriangleIcon,
  user: UserIcon,
}

type IconProps = SVGAttributes<SVGElement> & {
  name: keyof typeof icons
}

export const Icon = ({ name, ...rest }: IconProps) => {
  const Component = icons[name]

  return <Component {...rest} />
}
