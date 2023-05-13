import { Label } from '@radix-ui/react-label'
import React, { forwardRef, type InputHTMLAttributes } from 'react'
import { type FieldError } from 'react-hook-form'

import {
  label as labelClass,
  input,
  error as errorClass,
  labelText,
} from './Field.css'

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
      <Label className={labelClass}>
        <div className={labelText}>{label}</div>
        <input ref={ref} className={input} {...rest} />
      </Label>
      {error && <p className={errorClass}>{error.message}</p>}
    </div>
  )
})
