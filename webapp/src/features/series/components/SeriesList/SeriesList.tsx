import { useQuery } from '@apollo/client'
import classNames from 'classnames'
import React from 'react'

import { Link, LoadingSpinner } from '@/components'
import { graphql } from '@/generated/gql/gql'
import { type UserSeriesStatus } from '@/generated/gql/graphql'

import { SeriesPoster } from '../SeriesPoster'

import { ReactComponent as EmptyList } from './EmptyList.svg'
import { LatestSeenEpisodeCell } from './LatestSeenEpisodeCell'
import * as s from './SeriesList.css'

type SeriesListProps = {
  status?: UserSeriesStatus
}

export const SeriesList = ({ status }: SeriesListProps) => {
  const { data, loading } = useQuery(
    graphql(`
      query seriesList($input: UserSeriesListInput!) {
        userSeriesList(input: $input) {
          __typename
          ... on Error {
            message
          }
          ... on QueryUserSeriesListSuccess {
            data {
              id
              title
              ...SeriesPoster_SeriesFragment
              ...LatestSeenEpisodeCell_SeriesFragment
            }
          }
        }
      }
    `),
    {
      variables: {
        input: {
          status,
        },
      },
    },
  )

  const series =
    data?.userSeriesList.__typename === 'QueryUserSeriesListSuccess'
      ? data.userSeriesList.data
      : []

  return (
    <div className={s.container}>
      {loading || series.length ? (
        <>
          <table className={s.table}>
            <thead className={s.tableHead}>
              <tr>
                <th className={s.tableHeadCellPoster} />
                <th className={s.tableHeadCell}>Title</th>
                <th className={s.tableHeadCell}>Latest</th>
              </tr>
            </thead>
            <tbody>
              {series.map((oneSeries) => (
                <tr key={oneSeries.id}>
                  <td className={classNames(s.cell, s.cellPoster)}>
                    <SeriesPoster series={oneSeries} />
                  </td>
                  <td className={s.cell}>
                    <Link href={`/series/${oneSeries.id}`}>
                      {oneSeries.title}
                    </Link>
                  </td>
                  <td className={s.cell}>
                    <LatestSeenEpisodeCell series={oneSeries} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {loading && (
            <div className={s.loadingContainer}>
              <LoadingSpinner />
            </div>
          )}
        </>
      ) : null}

      {!series.length && !loading && (
        <div className={s.emptyListContainer}>
          <EmptyList className={s.emptyListIllustration} />
          <div className={s.emptyListText}>No series with this status</div>
        </div>
      )}
    </div>
  )
}
