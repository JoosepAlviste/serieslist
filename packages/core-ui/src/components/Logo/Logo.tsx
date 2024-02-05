import classNames from 'classnames'
import React, { type ComponentPropsWithoutRef } from 'react'

import { Icon } from '../Icon'

import * as s from './Logo.css'

type LogoProps = ComponentPropsWithoutRef<'div'>

export const Logo = ({ className, ...rest }: LogoProps) => (
  <div className={classNames(s.logo, className)} {...rest}>
    <Icon name="logo" size="l" label="Home" />
  </div>
)
