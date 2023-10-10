import React, { type ReactElement } from 'react'

import { Title } from '#/components'

import * as s from './AuthLayout.css'
import HorrorMovie from './HorrorMovie.svg?react'

type AuthLayoutProps = {
  children: ReactElement | ReactElement[]
  otherAction: ReactElement
}

export const AuthLayout = ({ children, otherAction }: AuthLayoutProps) => {
  return (
    <div className={s.container}>
      <div className={s.formSide}>
        <Title className={s.title}>Serieslist</Title>

        {children}
        <div className={s.separatorContainer}>
          <div className={s.separator} />
          <div className={s.separatorText}>OR</div>
        </div>
        <div className={s.otherActionContainer}>{otherAction}</div>
      </div>

      <div className={s.illustrationSide}>
        <HorrorMovie
          aria-label="Two people sitting on a couch and watching a movie."
          className={s.illustration}
        />
      </div>
    </div>
  )
}
