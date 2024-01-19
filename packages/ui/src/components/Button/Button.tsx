import classNames from 'classnames'
import React, {
  type ForwardedRef,
  forwardRef,
  type HTMLAttributes,
  type ComponentPropsWithoutRef,
} from 'react'

import { useSSR } from '../../hooks'
import { Link, type LinkProps } from '../Link'

import * as s from './Button.css'

type ButtonBaseProps = {
  variant: keyof typeof s.button
  size?: keyof typeof s.buttonSize
  isDisabled?: boolean
}

type ButtonButtonProps = ComponentPropsWithoutRef<'button'> & ButtonBaseProps
type ButtonLinkProps = LinkProps & ButtonBaseProps

export type ButtonProps = ButtonButtonProps | ButtonLinkProps

const isLinkProps = (
  props: Omit<ButtonProps, 'variant' | 'size'>,
): props is ButtonLinkProps => {
  return 'href' in props
}

const ButtonBase = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(function Button(
  { variant, className, size = 'm', isDisabled = false, ...rest },
  ref,
) {
  const { isSSR } = useSSR()

  if (isLinkProps(rest)) {
    return (
      <Link
        ref={ref as ForwardedRef<HTMLAnchorElement>}
        className={classNames(
          s.button[variant],
          s.buttonSize[size],
          className,
          {
            [s.disabled]: isDisabled,
          },
        )}
        {...rest}
      />
    )
  }

  // Disable the button on the server and re-enable it once hydration is done.
  // Clicking on a button before hydration should not be possible And might
  // result in native form submissions (e.g., in UI tests because they are fast).
  const disabled = isDisabled || isSSR

  return (
    <button
      ref={ref as ForwardedRef<HTMLButtonElement>}
      className={classNames(s.button[variant], s.buttonSize[size], className, {
        [s.disabled]: disabled,
      })}
      type="button"
      disabled={disabled}
      // Firefox saves the `disabled` state of form elements and restores it on
      // the next page load, causing hydration mismatch errors. We can disable
      // that behaviour by disabling autocompletion on the elements (yes, even
      // on button elements...):
      // https://github.com/vercel/next.js/discussions/21999
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      autoComplete="off"
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
