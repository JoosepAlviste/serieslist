import { Title } from '@serieslist/core-ui'
import React from 'react'

import * as s from './AboutPage.css'
import TMDBLogo from './TMDBLogo.svg?react'

export const Page = () => (
  <div className={s.page}>
    <Title as="h1" className={s.title}>
      About Serieslist
    </Title>
    <p>
      This product uses the TMDB API but is not endorsed or certified by TMDB.
      <a target="_blank" href="https://www.themoviedb.org/" rel="noreferrer">
        <TMDBLogo className={s.tmdbLogo} />
      </a>
    </p>
  </div>
)
