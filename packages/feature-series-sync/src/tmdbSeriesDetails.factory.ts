import type { Series, Episode } from '@serieslist/core-db'
import type { TMDBEpisode, TMDBSeries } from '@serieslist/feature-tmdb'
import {
  tmdbSeriesDetailsFactory as baseTmdbSeriesDetailsFactory,
  tmdbEpisodeFactory as baseTmdbEpisodeFactory,
} from '@serieslist/feature-tmdb/test'
import type { NotWorthIt } from '@serieslist/util-types'
import { Factory } from 'fishery'
import filterObject from 'just-filter-object'

const removeUndefinedKeys = <T extends Record<string, unknown>>(obj: T) => {
  return filterObject(obj as NotWorthIt, (_key, value) => value !== undefined)
}

type TMDBSeriesDetailsTransientParams = {
  savedSeries?: Series
}

export const tmdbSeriesDetailsFactory = Factory.define<
  TMDBSeries,
  TMDBSeriesDetailsTransientParams
>(({ transientParams: { savedSeries } }) =>
  baseTmdbSeriesDetailsFactory.build(
    removeUndefinedKeys({
      id: savedSeries?.tmdbId,
      name: savedSeries?.title,
      poster_path: savedSeries?.poster,
      overview: savedSeries?.plot ?? undefined,
      first_air_date: savedSeries?.startYear
        ? `${savedSeries.startYear}-05-06`
        : undefined,
      external_ids: {
        imdb_id: savedSeries?.imdbId,
      },
    }),
  ),
)

type TMDBEpisodeTransientParams = {
  savedEpisode?: Episode
}

export const tmdbEpisodeFactory = Factory.define<
  TMDBEpisode,
  TMDBEpisodeTransientParams
>(({ transientParams: { savedEpisode } }) =>
  baseTmdbEpisodeFactory.build(
    removeUndefinedKeys({
      id: savedEpisode?.tmdbId,
      episode_number: savedEpisode?.number,
      name: savedEpisode?.title,
      air_date: savedEpisode?.releasedAt,
    }),
  ),
)
