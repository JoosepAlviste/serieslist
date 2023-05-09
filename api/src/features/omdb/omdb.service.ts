import fetch from 'node-fetch'
import { z } from 'zod'

import { config } from '@/config'
import { app } from '@/lib/fastify'

const seriesSchema = z.object({
  Title: z.string(),
  Year: z.string(),
  imdbID: z.string(),
  Poster: z.string(),
})

const seriesSearchResponseSchema = z
  .object({
    Search: z.array(seriesSchema),
  })
  .or(
    z.object({
      Response: z.string(),
      Error: z.string(),
    }),
  )

type OMDbSearchSeries = z.infer<typeof seriesSchema>

/**
 * Make a request to search for series from the OMDb API.
 */
export const searchSeriesFromOMDb = async (
  keyword: string,
): Promise<OMDbSearchSeries[]> => {
  const searchParams = new URLSearchParams({
    apiKey: config.omdb.apiKey,
    type: 'series',
    // The star is a wildcard, we search for words that start with the keyword.
    // Not officially documented, but I found it from
    // https://github.com/omdbapi/OMDb-API/issues/108
    s: `${keyword}*`,
  })
  const url = `${config.omdb.url}?${searchParams.toString()}`

  const res = await fetch(url)
  const json = await res.json()

  try {
    const seriesSearchResponse = seriesSearchResponseSchema.parse(json)
    if ('Error' in seriesSearchResponse) {
      // No result found or other error
      return []
    }

    return seriesSearchResponse.Search
  } catch (e) {
    // The OMDb response format did not match the expected format. We should
    // probably improve the schema.
    // This might not need to be a warning, can be changed in the future.
    app.log.warn('OMDb API response did not match the schema.', {
      url,
      json,
    })

    return []
  }
}
