import type { ColumnType } from 'kysely'

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>

export type Numeric = ColumnType<string, string | number, string | number>

export type Timestamp = ColumnType<Date, Date | string, Date | string>

export type UserSeriesStatusStatus =
  | 'Completed'
  | 'InProgress'
  | 'OnHold'
  | 'PlanToWatch'

export type Episode = {
  id: Generated<number>
  imdbId: string
  seasonId: number
  number: number
  title: string
  releasedAt: Timestamp | null
  imdbRating: Numeric | null
}

export type Season = {
  id: Generated<number>
  seriesId: number
  number: number
}

export type Series = {
  id: Generated<number>
  imdbId: string
  title: string
  poster: string | null
  startYear: number
  endYear: number | null
  createdAt: Generated<Timestamp>
  updatedAt: Generated<Timestamp>
  runtimeMinutes: number | null
  plot: string | null
  imdbRating: number | null
  syncedAt: Timestamp | null
}

export type Session = {
  token: string
  userId: number | null
  ip: string | null
  userAgent: string | null
  isValid: Generated<boolean | null>
  createdAt: Generated<Timestamp>
  updatedAt: Generated<Timestamp>
}

export type User = {
  id: Generated<number>
  name: string
  email: string
  isAdmin: Generated<boolean | null>
  password: string
  createdAt: Generated<Timestamp>
  updatedAt: Generated<Timestamp>
}

export type UserSeriesStatus = {
  seriesId: number
  userId: number
  status: UserSeriesStatusStatus | null
  createdAt: Generated<Timestamp>
  updatedAt: Generated<Timestamp>
}

export type DB = {
  episode: Episode
  season: Season
  series: Series
  session: Session
  user: User
  userSeriesStatus: UserSeriesStatus
}
