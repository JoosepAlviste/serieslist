import { Text, Title } from '@serieslist/ui'
import React from 'react'

import { usePageContext } from '#/hooks'

import Illustration404 from './404.svg?react'
import * as s from './_error.page.css'
import ServerDown from './ServerDown.svg?react'

export const Page = () => {
  const { abortReason, is404 } = usePageContext()

  if (is404) {
    return (
      <div className={s.container}>
        <Illustration404 className={s.illustration} />
        <Title size="l" className={s.title}>
          Page not found
        </Title>
        {abortReason ? <Text variant="tertiary">{abortReason}</Text> : null}
      </div>
    )
  } else {
    return (
      <div className={s.container}>
        <ServerDown className={s.illustration} />
        <Title size="l" className={s.title}>
          Internal server error
        </Title>
        <Text variant="tertiary">Something went wrong...</Text>
      </div>
    )
  }
}
