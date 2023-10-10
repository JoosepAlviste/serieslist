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
        <h1 className={s.title}>Page not found</h1>
        {abortReason ? <p className={s.text}>{abortReason}</p> : null}
      </div>
    )
  } else {
    return (
      <div className={s.container}>
        <ServerDown className={s.illustration} />
        <h1 className={s.title}>Internal server error</h1>
        <p className={s.text}>Something went wrong...</p>
      </div>
    )
  }
}
