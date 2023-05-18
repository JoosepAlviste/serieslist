import { Factory } from 'fishery'

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

export const omdbEpisodeFactory = Factory.define<OMDbEpisode>(
  ({ sequence }) => ({
    Episode: String(sequence),
    Title: 'Test Episode',
    imdbRating: '6.7',
    imdbID: `tte${sequence}`,
    Released: '2022-01-01',
  }),
)
