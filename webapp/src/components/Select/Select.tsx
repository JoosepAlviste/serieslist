import * as BaseSelect from '@radix-ui/react-select'
import React from 'react'

import { Icon } from '../Icon'

import * as s from './Select.css'

type Option = {
  value: string
  label: string
}

type SelectProps<T extends string = string> = {
  options: Option[]
  value: T
  onChange: (value: T) => void
}

export const Select = <T extends string>({
  options,
  onChange,
  value,
}: SelectProps<T>) => {
  const selectedOption = options.find((option) => option.value === value)

  return (
    <BaseSelect.Root onValueChange={onChange} value={value}>
      <BaseSelect.Trigger className={s.trigger}>
        <BaseSelect.Value placeholder={selectedOption?.label} />
        <BaseSelect.Icon>
          <Icon name="triangle" aria-hidden className={s.triangle} />
        </BaseSelect.Icon>
      </BaseSelect.Trigger>
      <BaseSelect.Portal>
        <BaseSelect.Content className={s.content}>
          <BaseSelect.Viewport>
            {options.map(({ value, label }) => (
              <BaseSelect.Item key={value} value={value} className={s.item}>
                <BaseSelect.ItemIndicator className={s.itemCheck}>
                  <Icon name="check" aria-hidden className={s.itemCheckIcon} />
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
