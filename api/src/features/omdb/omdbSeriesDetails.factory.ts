import { format } from 'date-fns'
import { Factory } from 'fishery'
import { type Selectable } from 'kysely'
import { nanoid } from 'nanoid'

import { type Episode } from '@/generated/db'

import { type OMDbEpisode, type OMDbSeries } from './types'

export const omdbSeriesDetailsFactory = Factory.define<OMDbSeries>(
  ({ sequence }) => ({
    Plot: 'Test plot.',
    Year: '2020–2023',
    Title: 'Test Series',
    imdbID: `tts${sequence}`,
    Poster: 'foo.jpg',
    Runtime: '22 min',
    imdbRating: '8.5',
    totalSeasons: '3',
  }),
)

type OMDbEpisodeTransientParams = {
  savedEpisode?: Selectable<Episode>
}

export const omdbEpisodeFactory = Factory.define<
  OMDbEpisode,
  OMDbEpisodeTransientParams
>(({ sequence, transientParams: { savedEpisode } }) => ({
  Episode: savedEpisode?.number
    ? String(savedEpisode.number)
    : String(sequence),
  Title: savedEpisode?.title ?? 'Test Episode',
  imdbRating: savedEpisode?.imdbRating ?? '6.7',
  imdbID: savedEpisode?.imdbId ?? `tt${nanoid(8)}e${sequence}`,
  Released: savedEpisode?.releasedAt
    ? format(savedEpisode.releasedAt, 'yyyy-MM-dd')
    : '2022-01-01',
}))
