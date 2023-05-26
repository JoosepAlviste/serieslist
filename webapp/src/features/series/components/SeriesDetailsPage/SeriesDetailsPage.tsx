import { useQuery } from '@apollo/client'
import React from 'react'

import { graphql } from '@/generated/gql'

type SeriesDetailsPageProps = {
  seriesId: string
}

export const SeriesDetailsPage = ({ seriesId }: SeriesDetailsPageProps) => {
  const { data, loading, error } = useQuery(
    graphql(`
      query seriesDetailsPage($id: ID!) {
        series(id: $id) {
          __typename
          ... on NotFoundError {
            message
          }
          ... on Series {
            id
            imdbId
            title
            poster
            startYear
            endYear
            seasons {
              id
              number
              episodes {
                id
                imdbId
                number
                title
                releasedAt
                imdbRating
              }
            }
          }
        }
      }
    `),
    {
      variables: {
        id: seriesId,
      },
    },
  )

  const series = data?.series.__typename === 'Series' ? data.series : null

  return (
    <div>
      {loading && <div>Loading...</div>}

      {series ? (
        <>
          <h1>{series.title}</h1>
        </>
      ) : null}
    </div>
  )
}
