import classNames from 'classnames'
import React, { type ComponentPropsWithoutRef } from 'react'

import * as s from './MenuTrigger.css'

type MenuTriggerProps = ComponentPropsWithoutRef<'button'> & {
  isActive: boolean
  onClick: () => void
}

/**
 * Burger animation from: https://codepen.io/banik/pen/BVrNXP
 */
export const MenuTrigger = ({
  isActive,
  onClick,
  className,
  ...rest
}: MenuTriggerProps) => (
  <button
    type="button"
    className={classNames(s.burgerContainer, className)}
    onClick={onClick}
    {...rest}
  >
    <div
      className={classNames(s.burger, {
        [s.burgerOpen]: isActive,
      })}
    >
      <div className={s.burgerBunTop}></div>
      <div className={s.burgerPattyOne}></div>
      <div className={s.burgerPattyTwo}></div>
      <div className={s.burgerBunBottom}></div>
    </div>
  </button>
)
