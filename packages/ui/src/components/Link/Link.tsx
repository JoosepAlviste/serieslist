import classNames from 'classnames'
import React, {
  forwardRef,
  type ReactNode,
  type ComponentPropsWithoutRef,
} from 'react'

import * as s from './Link.css'

export type LinkProps = ComponentPropsWithoutRef<'a'> & {
  activeClass?: string
  activeUrlPrefix?: string
  children: ReactNode
  currentUrl?: string
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { className, activeClass, activeUrlPrefix, currentUrl, ...rest },
  ref,
) {
  const isActive = activeUrlPrefix
    ? currentUrl?.startsWith(activeUrlPrefix)
    : currentUrl === rest.href

  return (
    <a
      className={classNames(
        s.link,
        {
          [activeClass ?? '']: activeClass && isActive,
        },
        className,
      )}
      ref={ref}
      {...rest}
    />
  )
})
