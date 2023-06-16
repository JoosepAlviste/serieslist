import React, { type ReactElement } from 'react'

import * as s from './AuthLayout.css'
import { ReactComponent as HorrorMovie } from './HorrorMovie.svg'

type AuthLayoutProps = {
  children: ReactElement | ReactElement[]
  otherAction: ReactElement
}

export const AuthLayout = ({ children, otherAction }: AuthLayoutProps) => {
  return (
    <div className={s.container}>
      <div className={s.formSide}>
        <h1 className={s.title}>Serieslist</h1>

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
