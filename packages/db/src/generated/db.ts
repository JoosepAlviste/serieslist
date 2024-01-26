import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Numeric = ColumnType<string, string | number, string | number>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type UserSeriesStatusStatus = "Completed" | "InProgress" | "OnHold" | "PlanToWatch";

export interface Episode {
  id: Generated<number>;
  imdbId: string | null;
  seasonId: number;
  number: number;
  title: string;
  releasedAt: Timestamp | null;
  imdbRating: Numeric | null;
  tmdbId: number;
}

export interface Season {
  id: Generated<number>;
  seriesId: number;
  number: number;
  tmdbId: number;
  title: string;
}

export interface SeenEpisode {
  userId: number;
  episodeId: number;
  createdAt: Generated<Timestamp>;
}

export interface Series {
  id: Generated<number>;
  imdbId: string | null;
  title: string;
  poster: string | null;
  startYear: number | null;
  endYear: number | null;
  createdAt: Generated<Timestamp>;
  updatedAt: Generated<Timestamp>;
  runtimeMinutes: number | null;
  plot: string | null;
  imdbRating: Numeric | null;
  syncedAt: Timestamp | null;
  tmdbId: number;
}

export interface SeriesProgress {
  userId: number;
  seriesId: number;
  latestSeenEpisodeId: number;
  nextEpisodeId: number | null;
  createdAt: Generated<Timestamp>;
  updatedAt: Generated<Timestamp>;
}

export interface Session {
  token: string;
  userId: number | null;
  ip: string | null;
  userAgent: string | null;
  isValid: Generated<boolean | null>;
  createdAt: Generated<Timestamp>;
  updatedAt: Generated<Timestamp>;
}

export interface User {
  id: Generated<number>;
  name: string;
  email: string;
  isAdmin: Generated<boolean | null>;
  password: string;
  createdAt: Generated<Timestamp>;
  updatedAt: Generated<Timestamp>;
}

export interface UserSeriesStatus {
  seriesId: number;
  userId: number;
  status: UserSeriesStatusStatus;
  createdAt: Generated<Timestamp>;
  updatedAt: Generated<Timestamp>;
}

export interface DB {
  episode: Episode;
  season: Season;
  seenEpisode: SeenEpisode;
  series: Series;
  seriesProgress: SeriesProgress;
  session: Session;
  user: User;
  userSeriesStatus: UserSeriesStatus;
}
