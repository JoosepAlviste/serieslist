import classNames from 'classnames'
import React, {
  type ForwardedRef,
  forwardRef,
  type HTMLAttributes,
  type ComponentPropsWithoutRef,
} from 'react'

import { Link, type LinkProps } from '../Link'

import * as s from './Button.css'

type ButtonBaseProps = {
  variant: keyof typeof s.button
}

type ButtonButtonProps = ComponentPropsWithoutRef<'button'> & ButtonBaseProps
type ButtonLinkProps = LinkProps & ButtonBaseProps

type ButtonProps = ButtonButtonProps | ButtonLinkProps

const isLinkProps = (
  props: Omit<ButtonProps, 'variant'>,
): props is ButtonLinkProps => {
  return 'href' in props
}

const ButtonBase = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(function Button({ variant, className, ...rest }, ref) {
  if (isLinkProps(rest)) {
    return (
      <Link
        ref={ref as ForwardedRef<HTMLAnchorElement>}
        className={classNames(s.button[variant], className)}
        {...rest}
      />
    )
  }

  return (
    <button
      ref={ref as ForwardedRef<HTMLButtonElement>}
      className={classNames(s.button[variant], className)}
      type="button"
      {...(rest as ComponentPropsWithoutRef<'button'>)}
    />
  )
})

const ButtonIcon = ({ className, ...rest }: HTMLAttributes<HTMLDivElement>) => (
  <div className={classNames(s.buttonIcon, className)} {...rest} />
)

// To make TypeScript work better with compound components
// https://stackoverflow.com/a/70230573/7044732
type Button = {
  Icon: typeof ButtonIcon
} & typeof ButtonBase

export const Button = {
  ...ButtonBase,
  Icon: ButtonIcon,
} as Button
