import { useQuery } from '@apollo/client'
import classNames from 'classnames'
import React from 'react'

import { Link, LoadingSpinner } from '@/components'
import { useFragment, type FragmentType } from '@/generated/gql'
import { graphql } from '@/generated/gql/gql'
import { type UserSeriesStatus } from '@/generated/gql/graphql'

import { SeriesPoster } from '../SeriesPoster'

import { ReactComponent as EmptyList } from './EmptyList.svg'
import { LatestSeenEpisodeCell } from './LatestSeenEpisodeCell'
import * as s from './SeriesList.css'

const SeriesRow_SeriesFragment = graphql(`
  fragment SeriesRow_SeriesFragment on Series {
    id
    title
    ...SeriesPoster_SeriesFragment
    ...LatestSeenEpisodeCell_SeriesFragment
  }
`)

type SeriesRowProps = {
  serie: FragmentType<typeof SeriesRow_SeriesFragment>
  className?: string
}

const SeriesRow = ({ serie: serieOriginal, className }: SeriesRowProps) => {
  const serie = useFragment(SeriesRow_SeriesFragment, serieOriginal)

  return (
    <tr className={className}>
      <td className={classNames(s.cell, s.cellPoster)}>
        <SeriesPoster series={serie} />
      </td>
      <td className={s.cell}>
        <Link href={`/series/${serie.id}`}>{serie.title}</Link>
      </td>
      <td className={s.cell}>
        <LatestSeenEpisodeCell series={serie} />
      </td>
    </tr>
  )
}

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
              nextEpisode {
                id
              }
              ...SeriesRow_SeriesFragment
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
  const seriesWithNextEpisodeAvailable = series.filter(
    (serie) => serie.nextEpisode,
  )
  const seriesWithNoNextEpisodeAvailable = series.filter(
    (serie) => !serie.nextEpisode,
  )

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
              {seriesWithNextEpisodeAvailable.map((oneSeries, index) => (
                <SeriesRow
                  key={oneSeries.id}
                  serie={oneSeries}
                  className={
                    index === seriesWithNextEpisodeAvailable.length - 1
                      ? s.lastRowNextEpisodeAvailable
                      : undefined
                  }
                />
              ))}
              {seriesWithNextEpisodeAvailable.length &&
              seriesWithNoNextEpisodeAvailable.length ? (
                <tr>
                  <td
                    className={classNames(s.tableHeadCell, s.cellSubheading)}
                  />
                  <td
                    colSpan={2}
                    className={classNames(s.tableHeadCell, s.cellSubheading)}
                  >
                    Waiting for more episodes
                  </td>
                </tr>
              ) : null}
              {seriesWithNoNextEpisodeAvailable.map((oneSeries) => (
                <SeriesRow key={oneSeries.id} serie={oneSeries} />
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
