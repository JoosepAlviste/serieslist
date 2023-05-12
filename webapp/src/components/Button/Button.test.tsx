import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'

import { Button } from './Button'

describe('components/Button', () => {
  it('allows clicking on the button', () => {
    const onClickMock = vi.fn()

    render(
      <Button onClick={onClickMock} variant="ghost">
        Hello
      </Button>,
    )

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Hello',
      }),
    )

    expect(onClickMock).toHaveBeenCalled()
  })
})
