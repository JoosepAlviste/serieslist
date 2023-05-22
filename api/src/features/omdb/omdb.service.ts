import fetch from 'node-fetch'
import { type z } from 'zod'

import { config } from '@/config'
import { NotFoundError } from '@/lib/errors'
import { app } from '@/lib/fastify'

import {
  omdbSeasonSchema,
  omdbSeriesSchema,
  omdbSeriesSearchResponseSchema,
} from './omdb.schemas'
import { type OMDbSearchSeries } from './types'

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
    app.log.warn('OMDb API response did not match the schema.', {
      url,
      json,
    })

    return null
  }
}

/**
 * Make a request to search for series from the OMDb API.
 */
export const searchSeriesFromOMDb = async (
  keyword: string,
): Promise<OMDbSearchSeries[]> => {
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

  return seriesSearchResponse.Search
}

export const fetchSeriesDetailsFromOMDb = async (imdbId: string) => {
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

  return seriesDetails
}

export const fetchSeasonDetailsFromOMDb = async (
  imdbId: string,
  seasonNumber: number,
) => {
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

  return season
}

export const parseOMDbSeriesYears = (years: string) => {
  let startYear = years
  let endYear = years
  if (years.includes('–')) {
    // NOTE: This is not a regular dash, but an en-dash
    const yearsSplit = years.split('–')
    if (yearsSplit[0] !== undefined) {
      startYear = yearsSplit[0]
    }
    if (yearsSplit[1] !== undefined) {
      endYear = yearsSplit[1]
    }
  }

  return {
    startYear: parseInt(startYear, 10),
    endYear: endYear ? parseInt(endYear, 10) : null,
  }
}

export const parseOMDbSeriesRuntime = (runtime: string): number | null => {
  const match = runtime.match(/(\d+)/g)
  if (!match) {
    return null
  }

  return parseInt(match[0])
}
