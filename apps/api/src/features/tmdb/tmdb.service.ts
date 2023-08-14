import { type Insertable } from 'kysely'
import fetch from 'node-fetch'
import { type z } from 'zod'

import { config } from '@/config'
import { type Season, type Series } from '@/generated/db'
import { log } from '@/lib/logger'

import {
  tmdbSeasonResponseSchema,
  tmdbSeriesResponseSchema,
  tmdbSeriesSearchResponseSchema,
} from './tmdb.schemas'
import { type TMDbSeries, type TMDbSearchSeries } from './types'

const makeTMDbRequest = async <T>(
  url: string,
  queryParams: Record<string, string>,
  schema: z.ZodSchema<T>,
) => {
  const searchParams = new URLSearchParams(queryParams)
  const queryString = Object.keys(queryParams).length
    ? `?${searchParams.toString()}`
    : ''
  const fullUrl = `${config.tmdb.url}/3/${url}${queryString}`

  const res = await fetch(fullUrl, {
    headers: {
      Authorization: `Bearer ${config.tmdb.apiToken}`,
    },
  })
  const json = (await res.json()) as T

  try {
    return { parsed: true, response: schema.parse(json) }
  } catch (e) {
    log.warn(
      {
        fullUrl,
        json,
        e,
      },
      'TMDB API response did not match the schema.',
    )

    return { parsed: false, response: null }
  }
}

const parseSeriesFromTMDbResponse = (
  tmdbSeries: TMDbSearchSeries | TMDbSeries,
): Insertable<Series> => ({
  tmdbId: tmdbSeries.id,
  imdbId: 'external_ids' in tmdbSeries ? tmdbSeries.external_ids.imdb_id : null,
  title: tmdbSeries.name,
  poster: tmdbSeries.poster_path,
  plot: tmdbSeries.overview,
  startYear:
    typeof tmdbSeries.first_air_date !== 'string'
      ? tmdbSeries.first_air_date.getFullYear()
      : null,
  // There is no explicit end year in TMDB, so we need to calculate it from the
  // last episode air date if the series is no longer running.
  endYear:
    'status' in tmdbSeries && 'last_air_date' in tmdbSeries
      ? ['Ended', 'Canceled'].includes(tmdbSeries.status) &&
        tmdbSeries.last_air_date
        ? tmdbSeries.last_air_date.getFullYear()
        : null
      : undefined,
})

/**
 * Make a request to search for series from the TMDB API.
 */
export const searchSeries = async ({
  keyword,
}: {
  keyword: string
}): Promise<Insertable<Series>[]> => {
  const { response } = await makeTMDbRequest(
    'search/tv',
    { query: keyword },
    tmdbSeriesSearchResponseSchema,
  )

  if (!response) {
    // No result found or other error
    return []
  }

  return response.results.map(parseSeriesFromTMDbResponse)
}

export const fetchSeriesDetails = async ({ tmdbId }: { tmdbId: number }) => {
  const { parsed, response } = await makeTMDbRequest(
    `tv/${tmdbId}`,
    { append_to_response: 'external_ids' },
    tmdbSeriesResponseSchema,
  )
  if (!response || 'success' in response) {
    return { parsed, found: false, series: null, totalSeasons: 0, seasons: [] }
  }

  return {
    found: true,
    parsed: true,
    series: parseSeriesFromTMDbResponse(response),
    totalSeasons: response.number_of_seasons,
    seasons: response.seasons.map(
      (season): Omit<Insertable<Season>, 'seriesId'> => ({
        tmdbId: season.id,
        number: season.season_number,
        title: season.name,
      }),
    ),
  }
}

export const fetchEpisodesForSeason = async ({
  tmdbId,
  seasonNumber,
}: {
  tmdbId: number
  seasonNumber: number
}) => {
  const { response, parsed } = await makeTMDbRequest(
    `tv/${tmdbId}/season/${seasonNumber}`,
    {},
    tmdbSeasonResponseSchema,
  )
  if (!response || 'success' in response) {
    return {
      parsed,
      found: false,
      seasonNumber: 0,
      seasonTitle: '',
      episodes: [],
    }
  }

  return {
    parsed,
    found: true,
    seasonNumber: response.season_number,
    seasonTitle: response.name,
    episodes: response.episodes.map((episode) => ({
      tmdbId: episode.id,
      number: episode.episode_number,
      title: episode.name,
      releasedAt: episode.air_date,
    })),
  }
}
