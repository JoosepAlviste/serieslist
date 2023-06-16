import { Label } from '@radix-ui/react-label'
import classNames from 'classnames'
import React, { forwardRef, type InputHTMLAttributes } from 'react'
import { type FieldError } from 'react-hook-form'

import { Error } from '@/components'

import * as s from './Field.css'

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  error?: FieldError
}

export const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { label, error, ...rest }: FieldProps,
  ref,
) {
  return (
    <div>
      <Label className={s.label}>
        <div className={s.labelText}>{label}</div>
        <div
          className={classNames(s.inputContainer, {
            [s.inputContainerHasError]: !!error,
          })}
        >
          <input ref={ref} className={s.input} {...rest} />
        </div>
      </Label>
      <Error className={s.error}>{error?.message}</Error>
    </div>
  )
})
