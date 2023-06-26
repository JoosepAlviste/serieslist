import * as BaseSelect from '@radix-ui/react-select'
import React, { type ForwardedRef, forwardRef } from 'react'

import { Icon } from '../Icon'

import * as s from './Select.css'

// Make forwardRef work with generic component types. This should not affect the
// `forwardRef` types globally.
// https://fettblog.eu/typescript-react-generic-forward-refs/
declare module 'react' {
  function forwardRef<T, P = object>(
    render: (props: P, ref: React.Ref<T>) => React.ReactElement | null,
  ): (props: P & React.RefAttributes<T>) => React.ReactElement | null
}

type Option = {
  value: string
  label: string
}

type SelectProps<T extends string = string> = {
  options: Option[]
  value: T
  label: string
  onChange: (value: T) => void
}

function SelectInner<T extends string = string>(
  { options, onChange, value, label }: SelectProps<T>,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  const selectedOption = options.find((option) => option.value === value)

  return (
    <BaseSelect.Root onValueChange={onChange} value={value}>
      <BaseSelect.Trigger className={s.trigger} aria-label={label} ref={ref}>
        <BaseSelect.Value placeholder={selectedOption?.label} />
        <BaseSelect.Icon>
          <Icon size="s" name="triangle" aria-hidden className={s.triangle} />
        </BaseSelect.Icon>
      </BaseSelect.Trigger>
      <BaseSelect.Portal>
        <BaseSelect.Content className={s.content}>
          <BaseSelect.Viewport>
            {options.map(({ value, label }) => (
              <BaseSelect.Item key={value} value={value} className={s.item}>
                <BaseSelect.ItemIndicator className={s.itemCheck}>
                  <Icon
                    name="check"
                    size="s"
                    aria-hidden
                    className={s.itemCheckIcon}
                  />
                </BaseSelect.ItemIndicator>
                <BaseSelect.ItemText>{label}</BaseSelect.ItemText>
              </BaseSelect.Item>
            ))}
          </BaseSelect.Viewport>
        </BaseSelect.Content>
      </BaseSelect.Portal>
    </BaseSelect.Root>
  )
}

export const Select = forwardRef(SelectInner)
