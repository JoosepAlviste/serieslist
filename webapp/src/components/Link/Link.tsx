import classNames from 'classnames'
import React, {
  forwardRef,
  type ReactNode,
  type ComponentPropsWithoutRef,
} from 'react'

import { usePageContext } from '@/hooks'

export type LinkProps = ComponentPropsWithoutRef<'a'> & {
  activeClass?: string
  children: ReactNode
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { className, activeClass, ...rest },
  ref,
) {
  const pageContext = usePageContext()

  return (
    <a
      className={classNames(
        {
          [activeClass ?? '']:
            activeClass && pageContext.urlPathname === rest.href,
        },
        className,
      )}
      ref={ref}
      {...rest}
    />
  )
})
