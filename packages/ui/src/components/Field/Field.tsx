import { Label } from '@radix-ui/react-label'
import classNames from 'classnames'
import React, { forwardRef, type InputHTMLAttributes } from 'react'
import { type FieldError } from 'react-hook-form'

import { useSSR } from '../../hooks'
import { Error } from '../Error'
import { Text } from '../Text'

import * as s from './Field.css'

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  error?: FieldError
}

export const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { label, error, disabled = false, ...rest }: FieldProps,
  ref,
) {
  const { isSSR } = useSSR()

  return (
    <div>
      <Label className={s.label}>
        <Text variant="secondary" className={s.labelText}>
          {label}
        </Text>
        <div
          className={classNames(s.inputContainer, {
            [s.inputContainerHasError]: !!error,
          })}
        >
          <input
            ref={ref}
            className={s.input}
            disabled={disabled || isSSR}
            // Firefox saves the `disabled` state of form elements and restores
            // it on the next page load, causing hydration mismatch errors. We
            // can disable that behaviour by disabling autocompletion on the
            // elements:
            // https://github.com/vercel/next.js/discussions/21999
            autoComplete={isSSR ? 'off' : undefined}
            {...rest}
          />
        </div>
      </Label>
      <Error className={s.error}>{error?.message}</Error>
    </div>
  )
})
