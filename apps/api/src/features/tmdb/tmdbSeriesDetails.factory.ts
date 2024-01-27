import type { Series, Episode } from '@serieslist/db'
import type { TMDBEpisode, TMDBSeries } from '@serieslist/tmdb'
import {
  tmdbSeriesDetailsFactory as baseTmdbSeriesDetailsFactory,
  tmdbEpisodeFactory as baseTmdbEpisodeFactory,
} from '@serieslist/tmdb/test'
import type { NotWorthIt } from '@serieslist/type-utils'
import { Factory } from 'fishery'
import filterObject from 'just-filter-object'
import type { Selectable } from 'kysely'

const removeUndefinedKeys = <T extends Record<string, unknown>>(obj: T) => {
  return filterObject(obj as NotWorthIt, (_key, value) => value !== undefined)
}

type TMDBSeriesDetailsTransientParams = {
  savedSeries?: Selectable<Series>
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
  savedEpisode?: Selectable<Episode>
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
