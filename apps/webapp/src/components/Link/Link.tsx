import classNames from 'classnames'
import React, {
  forwardRef,
  type ReactNode,
  type ComponentPropsWithoutRef,
} from 'react'

import { usePageContext } from '#/hooks'

import * as s from './Link.css'

export type LinkProps = ComponentPropsWithoutRef<'a'> & {
  activeClass?: string
  activeUrlPrefix?: string
  children: ReactNode
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { className, activeClass, activeUrlPrefix, ...rest },
  ref,
) {
  const pageContext = usePageContext()

  const isActive = activeUrlPrefix
    ? pageContext.urlPathname.startsWith(activeUrlPrefix)
    : pageContext.urlPathname === rest.href

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
