import React from 'react'

import * as s from './index.page.css'
import { ReactComponent as TMDBLogo } from './TMDBLogo.svg'

export const Page = () => (
  <div className={s.page}>
    <h1 className={s.title}>About Serieslist</h1>
    <p>
      This product uses the TMDB API but is not endorsed or certified by TMDB.
      <a target="_blank" href="https://www.themoviedb.org/" rel="noreferrer">
        <TMDBLogo className={s.tmdbLogo} />
      </a>
    </p>
  </div>
)
