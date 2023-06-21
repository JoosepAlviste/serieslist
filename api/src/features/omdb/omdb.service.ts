import { parse } from 'date-fns'
import { type Insertable } from 'kysely'
import fetch from 'node-fetch'
import { type z } from 'zod'

import { config } from '@/config'
import { type Series } from '@/generated/db'
import { NotFoundError } from '@/lib/errors'
import { app } from '@/lib/fastify'

import {
  omdbSeasonSchema,
  omdbSeriesSchema,
  omdbSeriesSearchResponseSchema,
} from './omdb.schemas'
import { type OMDbSeries, type OMDbSearchSeries } from './types'

const makeOMDbRequest = async <T>(
  data: Record<string, string>,
  schema: z.ZodSchema<T>,
) => {
  const searchParams = new URLSearchParams({
    apiKey: config.omdb.apiKey,
    ...data,
  })
  const url = `${config.omdb.url}?${searchParams.toString()}`

  const res = await fetch(url)
  const json = (await res.json()) as T

  try {
    return schema.parse(json)
  } catch (e) {
    app.log.warn(
      {
        url,
        json,
      },
      'OMDb API response did not match the schema.',
    )

    return null
  }
}

const parseSeriesFromOMDbResponse = (
  omdbSeries: OMDbSearchSeries | OMDbSeries,
): Insertable<Series> => ({
  imdbId: omdbSeries.imdbID,
  title: omdbSeries.Title,
  poster: omdbSeries.Poster,
  plot: 'Plot' in omdbSeries ? omdbSeries.Plot : null,
  runtimeMinutes:
    'Runtime' in omdbSeries
      ? parseOMDbSeriesRuntime({ runtime: omdbSeries.Runtime })
      : null,
  imdbRating:
    'imdbRating' in omdbSeries ? parseFloat(omdbSeries.imdbRating) : null,
  ...parseOMDbSeriesYears({ years: omdbSeries.Year }),
})

/**
 * Make a request to search for series from the OMDb API.
 */
export const searchSeries = async ({
  keyword,
}: {
  keyword: string
}): Promise<Insertable<Series>[]> => {
  const seriesSearchResponse = await makeOMDbRequest(
    {
      type: 'series',
      // The star is a wildcard, we search for words that start with the keyword.
      // Not officially documented, but I found it from
      // https://github.com/omdbapi/OMDb-API/issues/108
      s: `${keyword}*`,
    },
    omdbSeriesSearchResponseSchema,
  )

  if (!seriesSearchResponse || 'Error' in seriesSearchResponse) {
    // No result found or other error
    return []
  }

  return seriesSearchResponse.Search.map(parseSeriesFromOMDbResponse)
}

export const fetchSeriesDetails = async ({
  imdbId,
}: {
  imdbId: string
}): Promise<{ series: Insertable<Series>; totalSeasons: number }> => {
  const seriesDetails = await makeOMDbRequest(
    {
      i: imdbId,
      plot: 'full',
    },
    omdbSeriesSchema,
  )
  if (!seriesDetails) {
    throw new NotFoundError()
  }

  return {
    series: parseSeriesFromOMDbResponse(seriesDetails),
    totalSeasons: parseInt(seriesDetails.totalSeasons),
  }
}

export const fetchEpisodesForSeason = async ({
  imdbId,
  seasonNumber,
}: {
  imdbId: string
  seasonNumber: number
}) => {
  const season = await makeOMDbRequest(
    {
      i: imdbId,
      Season: String(seasonNumber),
    },
    omdbSeasonSchema,
  )
  if (!season) {
    throw new NotFoundError()
  }

  return {
    seasonNumber: parseInt(season.Season),
    episodes: season.Episodes.map((episode) => ({
      imdbId: episode.imdbID,
      number: parseInt(episode.Episode),
      title: episode.Title,
      releasedAt:
        episode.Released !== 'N/A'
          ? parse(episode.Released, 'yyyy-MM-dd', new Date())
          : null,
      imdbRating: parseFloat(episode.imdbRating) || null,
    })),
  }
}

export const parseOMDbSeriesYears = ({ years }: { years: string }) => {
  let startYear = years
  let endYear = years
  if (years.includes('–')) {
    // NOTE: This is not a regular dash, but an en-dash
    const yearsSplit = years.split('–')
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (yearsSplit[0] !== undefined) {
      startYear = yearsSplit[0]
    }
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (yearsSplit[1] !== undefined) {
      endYear = yearsSplit[1]
    }
  }

  return {
    startYear: parseInt(startYear, 10),
    endYear: endYear ? parseInt(endYear, 10) : null,
  }
}

export const parseOMDbSeriesRuntime = ({
  runtime,
}: {
  runtime: string
}): number | null => {
  const match = runtime.match(/(\d+)/g)
  if (!match) {
    return null
  }

  return parseInt(match[0])
}
