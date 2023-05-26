import classNames from 'classnames'
import React, { type ComponentPropsWithoutRef } from 'react'

import { type FragmentType, graphql, useFragment } from '@/generated/gql'

import * as s from './SeriesPoster.css'
import posterPlaceholder from './seriesPosterPlaceholder.svg'

const SeriesPoster_SeriesFragment = graphql(`
  fragment SeriesPoster_SeriesFragment on Series {
    poster
    title
  }
`)

type SeriesPosterSize = 'l' | 's'

type SeriesPosterProps = ComponentPropsWithoutRef<'div'> & {
  series: FragmentType<typeof SeriesPoster_SeriesFragment>
  size?: SeriesPosterSize
}

export const SeriesPoster = ({
  series: seriesOriginal,
  className,
  size = 's',
  ...rest
}: SeriesPosterProps) => {
  const series = useFragment(SeriesPoster_SeriesFragment, seriesOriginal)

  return (
    <div className={classNames(s.posterContainer[size], className)} {...rest}>
      <img
        src={series.poster ?? posterPlaceholder}
        className={s.poster}
        alt={`Poster for ${series.title}`}
      />
    </div>
  )
}
