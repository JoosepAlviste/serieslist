/* eslint-disable */
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core'
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>
}
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never }
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never
    }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string }
  String: { input: string; output: string }
  Boolean: { input: boolean; output: boolean }
  Int: { input: number; output: number }
  Float: { input: number; output: number }
  /** A local date string (i.e., with no associated timezone) in `YYYY-MM-DD` format, e.g. `2020-01-01`. */
  Date: { input: string; output: string }
}

export type BaseError = Error & {
  __typename: 'BaseError'
  message: Scalars['String']['output']
}

export type Episode = {
  __typename: 'Episode'
  id: Scalars['ID']['output']
  imdbId?: Maybe<Scalars['String']['output']>
  imdbRating?: Maybe<Scalars['Float']['output']>
  isSeen: Scalars['Boolean']['output']
  number: Scalars['Int']['output']
  releasedAt?: Maybe<Scalars['Date']['output']>
  season: Season
  title: Scalars['String']['output']
}

export type Error = {
  message: Scalars['String']['output']
}

export type InvalidInputError = Error & {
  __typename: 'InvalidInputError'
  fieldErrors: Array<InvalidInputErrorField>
  message: Scalars['String']['output']
}

export type InvalidInputErrorField = {
  __typename: 'InvalidInputErrorField'
  message: Scalars['String']['output']
  path: Array<Scalars['String']['output']>
}

export type LoginInput = {
  email: Scalars['String']['input']
  password: Scalars['String']['input']
}

export type MarkSeasonEpisodesAsSeenInput = {
  seasonId: Scalars['Int']['input']
}

export type MarkSeriesEpisodesAsSeenInput = {
  seriesId: Scalars['ID']['input']
}

export type Mutation = {
  __typename: 'Mutation'
  logOut: Scalars['Boolean']['output']
  login: MutationLoginResult
  markSeasonEpisodesAsSeen: MutationMarkSeasonEpisodesAsSeenResult
  markSeriesEpisodesAsSeen: MutationMarkSeriesEpisodesAsSeenResult
  register: MutationRegisterResult
  seriesUpdateStatus: MutationSeriesUpdateStatusResult
  toggleEpisodeSeen: MutationToggleEpisodeSeenResult
}

export type MutationLoginArgs = {
  input: LoginInput
}

export type MutationMarkSeasonEpisodesAsSeenArgs = {
  input: MarkSeasonEpisodesAsSeenInput
}

export type MutationMarkSeriesEpisodesAsSeenArgs = {
  input: MarkSeriesEpisodesAsSeenInput
}

export type MutationRegisterArgs = {
  input: RegisterInput
}

export type MutationSeriesUpdateStatusArgs = {
  input: SeriesUpdateStatusInput
}

export type MutationToggleEpisodeSeenArgs = {
  input: ToggleEpisodeSeenInput
}

export type MutationLoginResult = InvalidInputError | User

export type MutationMarkSeasonEpisodesAsSeenResult =
  | NotFoundError
  | Season
  | UnauthorizedError

export type MutationMarkSeriesEpisodesAsSeenResult =
  | NotFoundError
  | Series
  | UnauthorizedError

export type MutationRegisterResult = InvalidInputError | User

export type MutationSeriesUpdateStatusResult =
  | NotFoundError
  | Series
  | UnauthorizedError

export type MutationToggleEpisodeSeenResult =
  | Episode
  | NotFoundError
  | UnauthorizedError

export type NotFoundError = Error & {
  __typename: 'NotFoundError'
  message: Scalars['String']['output']
}

export type Query = {
  __typename: 'Query'
  hello: Scalars['String']['output']
  me: QueryMeResult
  series: QuerySeriesResult
  seriesSearch: Array<Series>
  userSeriesList: QueryUserSeriesListResult
}

export type QueryHelloArgs = {
  name?: InputMaybe<Scalars['String']['input']>
}

export type QuerySeriesArgs = {
  id: Scalars['ID']['input']
}

export type QuerySeriesSearchArgs = {
  input: SeriesSearchInput
}

export type QueryUserSeriesListArgs = {
  input: UserSeriesListInput
}

export type QueryMeResult = UnauthorizedError | User

export type QuerySeriesResult = InvalidInputError | NotFoundError | Series

export type QueryUserSeriesListResult =
  | QueryUserSeriesListSuccess
  | UnauthorizedError

export type QueryUserSeriesListSuccess = {
  __typename: 'QueryUserSeriesListSuccess'
  data: Array<Series>
}

export type RegisterInput = {
  email: Scalars['String']['input']
  name: Scalars['String']['input']
  password: Scalars['String']['input']
}

export type Season = {
  __typename: 'Season'
  episodes: Array<Episode>
  id: Scalars['ID']['output']
  number: Scalars['Int']['output']
  series: Series
  title: Scalars['String']['output']
}

export type Series = {
  __typename: 'Series'
  endYear?: Maybe<Scalars['Int']['output']>
  id: Scalars['ID']['output']
  imdbId?: Maybe<Scalars['String']['output']>
  latestSeenEpisode?: Maybe<Episode>
  nextEpisode?: Maybe<Episode>
  plot?: Maybe<Scalars['String']['output']>
  poster?: Maybe<Scalars['String']['output']>
  seasons: Array<Season>
  startYear?: Maybe<Scalars['Int']['output']>
  status?: Maybe<UserSeriesStatusStatus>
  title: Scalars['String']['output']
}

export type SeriesSearchInput = {
  keyword: Scalars['String']['input']
}

export type SeriesUpdateStatusInput = {
  seriesId: Scalars['Int']['input']
  status?: InputMaybe<UserSeriesStatusStatus>
}

export type ToggleEpisodeSeenInput = {
  episodeId: Scalars['Int']['input']
}

export type UnauthorizedError = Error & {
  __typename: 'UnauthorizedError'
  message: Scalars['String']['output']
}

export type User = {
  __typename: 'User'
  email: Scalars['String']['output']
  id: Scalars['ID']['output']
  name: Scalars['String']['output']
}

export type UserSeriesListInput = {
  status?: InputMaybe<UserSeriesStatusStatus>
}

export enum UserSeriesStatusStatus {
  Completed = 'Completed',
  InProgress = 'InProgress',
  OnHold = 'OnHold',
  PlanToWatch = 'PlanToWatch',
}

export type LoginMutationVariables = Exact<{
  input: LoginInput
}>

export type LoginMutation = {
  __typename: 'Mutation'
  login:
    | {
        __typename: 'InvalidInputError'
        message: string
        fieldErrors: Array<{
          __typename: 'InvalidInputErrorField'
          path: Array<string>
          message: string
        }>
      }
    | { __typename: 'User'; id: string; email: string }
}

export type RegisterMutationVariables = Exact<{
  input: RegisterInput
}>

export type RegisterMutation = {
  __typename: 'Mutation'
  register:
    | {
        __typename: 'InvalidInputError'
        message: string
        fieldErrors: Array<{
          __typename: 'InvalidInputErrorField'
          path: Array<string>
          message: string
        }>
      }
    | { __typename: 'User'; id: string; email: string }
}

export type CurrentUserQueryVariables = Exact<{ [key: string]: never }>

export type CurrentUserQuery = {
  __typename: 'Query'
  me:
    | { __typename: 'UnauthorizedError' }
    | { __typename: 'User'; id: string; email: string; name: string }
}

export type LogOutMutationVariables = Exact<{ [key: string]: never }>

export type LogOutMutation = { __typename: 'Mutation'; logOut: boolean }

export type SearchQueryVariables = Exact<{
  input: SeriesSearchInput
}>

export type SearchQuery = {
  __typename: 'Query'
  seriesSearch: Array<
    {
      __typename: 'Series'
      id: string
      imdbId?: string | null
      title: string
      startYear?: number | null
      endYear?: number | null
    } & {
      ' $fragmentRefs'?: {
        SeriesPoster_SeriesFragmentFragment: SeriesPoster_SeriesFragmentFragment
      }
    }
  >
}

export type EpisodeLine_EpisodeFragmentFragment = {
  __typename: 'Episode'
  id: string
  number: number
  title: string
  isSeen: boolean
  releasedAt?: string | null
} & { ' $fragmentName'?: 'EpisodeLine_EpisodeFragmentFragment' }

export type EpisodeLine_SeasonFragmentFragment = {
  __typename: 'Season'
  number: number
} & { ' $fragmentName'?: 'EpisodeLine_SeasonFragmentFragment' }

export type ToggleEpisodeSeenMutationVariables = Exact<{
  input: ToggleEpisodeSeenInput
}>

export type ToggleEpisodeSeenMutation = {
  __typename: 'Mutation'
  toggleEpisodeSeen:
    | {
        __typename: 'Episode'
        id: string
        isSeen: boolean
        season: {
          __typename: 'Season'
          id: string
          series: { __typename: 'Series'; id: string } & {
            ' $fragmentRefs'?: {
              LatestSeenEpisodeCell_SeriesFragmentFragment: LatestSeenEpisodeCell_SeriesFragmentFragment
            }
          }
        }
      }
    | { __typename: 'NotFoundError'; message: string }
    | { __typename: 'UnauthorizedError'; message: string }
}

export type SeriesDetailsPageQueryVariables = Exact<{
  id: Scalars['ID']['input']
}>

export type SeriesDetailsPageQuery = {
  __typename: 'Query'
  series:
    | { __typename: 'InvalidInputError' }
    | { __typename: 'NotFoundError'; message: string }
    | ({
        __typename: 'Series'
        id: string
        imdbId?: string | null
        title: string
        startYear?: number | null
        endYear?: number | null
        plot?: string | null
        seasons: Array<
          {
            __typename: 'Season'
            id: string
            number: number
            title: string
            episodes: Array<
              {
                __typename: 'Episode'
                id: string
                isSeen: boolean
                releasedAt?: string | null
              } & {
                ' $fragmentRefs'?: {
                  EpisodeLine_EpisodeFragmentFragment: EpisodeLine_EpisodeFragmentFragment
                }
              }
            >
          } & {
            ' $fragmentRefs'?: {
              EpisodeLine_SeasonFragmentFragment: EpisodeLine_SeasonFragmentFragment
            }
          }
        >
      } & {
        ' $fragmentRefs'?: {
          SeriesPoster_SeriesFragmentFragment: SeriesPoster_SeriesFragmentFragment
          SeriesStatusSelect_SeriesFragmentFragment: SeriesStatusSelect_SeriesFragmentFragment
        }
      })
}

export type MarkSeasonEpisodesAsSeenMutationVariables = Exact<{
  input: MarkSeasonEpisodesAsSeenInput
}>

export type MarkSeasonEpisodesAsSeenMutation = {
  __typename: 'Mutation'
  markSeasonEpisodesAsSeen:
    | { __typename: 'NotFoundError'; message: string }
    | {
        __typename: 'Season'
        id: string
        episodes: Array<{ __typename: 'Episode'; id: string; isSeen: boolean }>
        series: { __typename: 'Series'; id: string } & {
          ' $fragmentRefs'?: {
            LatestSeenEpisodeCell_SeriesFragmentFragment: LatestSeenEpisodeCell_SeriesFragmentFragment
          }
        }
      }
    | { __typename: 'UnauthorizedError'; message: string }
}

export type LatestSeenEpisodeCell_SeriesFragmentFragment = {
  __typename: 'Series'
  latestSeenEpisode?: {
    __typename: 'Episode'
    id: string
    number: number
    season: { __typename: 'Season'; id: string; number: number }
  } | null
  nextEpisode?: { __typename: 'Episode'; id: string } | null
} & { ' $fragmentName'?: 'LatestSeenEpisodeCell_SeriesFragmentFragment' }

export type LatestSeenEpisodeToggleEpisodeSeenMutationVariables = Exact<{
  input: ToggleEpisodeSeenInput
}>

export type LatestSeenEpisodeToggleEpisodeSeenMutation = {
  __typename: 'Mutation'
  toggleEpisodeSeen:
    | {
        __typename: 'Episode'
        id: string
        isSeen: boolean
        season: {
          __typename: 'Season'
          id: string
          series: { __typename: 'Series'; id: string } & {
            ' $fragmentRefs'?: {
              LatestSeenEpisodeCell_SeriesFragmentFragment: LatestSeenEpisodeCell_SeriesFragmentFragment
            }
          }
        }
      }
    | { __typename: 'NotFoundError'; message: string }
    | { __typename: 'UnauthorizedError'; message: string }
}

export type SeriesRow_SeriesFragmentFragment = ({
  __typename: 'Series'
  id: string
  title: string
} & {
  ' $fragmentRefs'?: {
    SeriesPoster_SeriesFragmentFragment: SeriesPoster_SeriesFragmentFragment
    LatestSeenEpisodeCell_SeriesFragmentFragment: LatestSeenEpisodeCell_SeriesFragmentFragment
  }
}) & { ' $fragmentName'?: 'SeriesRow_SeriesFragmentFragment' }

export type SeriesListQueryVariables = Exact<{
  input: UserSeriesListInput
}>

export type SeriesListQuery = {
  __typename: 'Query'
  userSeriesList:
    | {
        __typename: 'QueryUserSeriesListSuccess'
        data: Array<
          {
            __typename: 'Series'
            id: string
            nextEpisode?: { __typename: 'Episode'; id: string } | null
          } & {
            ' $fragmentRefs'?: {
              SeriesRow_SeriesFragmentFragment: SeriesRow_SeriesFragmentFragment
            }
          }
        >
      }
    | { __typename: 'UnauthorizedError'; message: string }
}

export type SeriesPoster_SeriesFragmentFragment = {
  __typename: 'Series'
  poster?: string | null
  title: string
} & { ' $fragmentName'?: 'SeriesPoster_SeriesFragmentFragment' }

export type SeriesStatusSelect_SeriesFragmentFragment = {
  __typename: 'Series'
  id: string
  status?: UserSeriesStatusStatus | null
} & { ' $fragmentName'?: 'SeriesStatusSelect_SeriesFragmentFragment' }

export type SeriesUpdateStatusMutationVariables = Exact<{
  input: SeriesUpdateStatusInput
}>

export type SeriesUpdateStatusMutation = {
  __typename: 'Mutation'
  seriesUpdateStatus:
    | { __typename: 'NotFoundError' }
    | {
        __typename: 'Series'
        id: string
        status?: UserSeriesStatusStatus | null
      }
    | { __typename: 'UnauthorizedError' }
}

export type MarkSeriesEpisodesAsSeenMutationVariables = Exact<{
  input: MarkSeriesEpisodesAsSeenInput
}>

export type MarkSeriesEpisodesAsSeenMutation = {
  __typename: 'Mutation'
  markSeriesEpisodesAsSeen:
    | { __typename: 'NotFoundError'; message: string }
    | ({
        __typename: 'Series'
        id: string
        seasons: Array<{
          __typename: 'Season'
          id: string
          episodes: Array<{
            __typename: 'Episode'
            id: string
            isSeen: boolean
          }>
        }>
      } & {
        ' $fragmentRefs'?: {
          LatestSeenEpisodeCell_SeriesFragmentFragment: LatestSeenEpisodeCell_SeriesFragmentFragment
        }
      })
    | { __typename: 'UnauthorizedError'; message: string }
}

export const EpisodeLine_EpisodeFragmentFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'EpisodeLine_EpisodeFragment' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Episode' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'number' } },
          { kind: 'Field', name: { kind: 'Name', value: 'title' } },
          { kind: 'Field', name: { kind: 'Name', value: 'isSeen' } },
          { kind: 'Field', name: { kind: 'Name', value: 'releasedAt' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<EpisodeLine_EpisodeFragmentFragment, unknown>
export const EpisodeLine_SeasonFragmentFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'EpisodeLine_SeasonFragment' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Season' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'number' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<EpisodeLine_SeasonFragmentFragment, unknown>
export const SeriesPoster_SeriesFragmentFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'SeriesPoster_SeriesFragment' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Series' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'poster' } },
          { kind: 'Field', name: { kind: 'Name', value: 'title' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<SeriesPoster_SeriesFragmentFragment, unknown>
export const LatestSeenEpisodeCell_SeriesFragmentFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'LatestSeenEpisodeCell_SeriesFragment' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Series' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'latestSeenEpisode' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'number' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'season' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'number' },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'nextEpisode' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  LatestSeenEpisodeCell_SeriesFragmentFragment,
  unknown
>
export const SeriesRow_SeriesFragmentFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'SeriesRow_SeriesFragment' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Series' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'title' } },
          {
            kind: 'FragmentSpread',
            name: { kind: 'Name', value: 'SeriesPoster_SeriesFragment' },
          },
          {
            kind: 'FragmentSpread',
            name: {
              kind: 'Name',
              value: 'LatestSeenEpisodeCell_SeriesFragment',
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'SeriesPoster_SeriesFragment' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Series' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'poster' } },
          { kind: 'Field', name: { kind: 'Name', value: 'title' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'LatestSeenEpisodeCell_SeriesFragment' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Series' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'latestSeenEpisode' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'number' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'season' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'number' },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'nextEpisode' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<SeriesRow_SeriesFragmentFragment, unknown>
export const SeriesStatusSelect_SeriesFragmentFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'SeriesStatusSelect_SeriesFragment' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Series' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'status' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<SeriesStatusSelect_SeriesFragmentFragment, unknown>
export const LoginDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'login' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'input' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'LoginInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'login' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'input' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'User' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                    ],
                  },
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'InvalidInputError' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'fieldErrors' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'path' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'message' },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'message' },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>
export const RegisterDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'register' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'input' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'RegisterInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'register' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'input' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'User' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                    ],
                  },
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'InvalidInputError' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'fieldErrors' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'path' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'message' },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'message' },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<RegisterMutation, RegisterMutationVariables>
export const CurrentUserDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'currentUser' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'me' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'User' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CurrentUserQuery, CurrentUserQueryVariables>
export const LogOutDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'logOut' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'logOut' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<LogOutMutation, LogOutMutationVariables>
export const SearchDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'search' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'input' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'SeriesSearchInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'seriesSearch' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'input' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'imdbId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                { kind: 'Field', name: { kind: 'Name', value: 'startYear' } },
                { kind: 'Field', name: { kind: 'Name', value: 'endYear' } },
                {
                  kind: 'FragmentSpread',
                  name: { kind: 'Name', value: 'SeriesPoster_SeriesFragment' },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'SeriesPoster_SeriesFragment' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Series' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'poster' } },
          { kind: 'Field', name: { kind: 'Name', value: 'title' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<SearchQuery, SearchQueryVariables>
export const ToggleEpisodeSeenDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'toggleEpisodeSeen' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'input' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'ToggleEpisodeSeenInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'toggleEpisodeSeen' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'input' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'Error' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'message' },
                      },
                    ],
                  },
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'Episode' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'isSeen' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'season' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'series' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'id' },
                                  },
                                  {
                                    kind: 'FragmentSpread',
                                    name: {
                                      kind: 'Name',
                                      value:
                                        'LatestSeenEpisodeCell_SeriesFragment',
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'LatestSeenEpisodeCell_SeriesFragment' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Series' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'latestSeenEpisode' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'number' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'season' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'number' },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'nextEpisode' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  ToggleEpisodeSeenMutation,
  ToggleEpisodeSeenMutationVariables
>
export const SeriesDetailsPageDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'seriesDetailsPage' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'series' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'NotFoundError' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'message' },
                      },
                    ],
                  },
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'Series' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'imdbId' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'startYear' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'endYear' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'plot' } },
                      {
                        kind: 'FragmentSpread',
                        name: {
                          kind: 'Name',
                          value: 'SeriesPoster_SeriesFragment',
                        },
                      },
                      {
                        kind: 'FragmentSpread',
                        name: {
                          kind: 'Name',
                          value: 'SeriesStatusSelect_SeriesFragment',
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'seasons' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'number' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'title' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'episodes' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'id' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'isSeen' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'releasedAt' },
                                  },
                                  {
                                    kind: 'FragmentSpread',
                                    name: {
                                      kind: 'Name',
                                      value: 'EpisodeLine_EpisodeFragment',
                                    },
                                  },
                                ],
                              },
                            },
                            {
                              kind: 'FragmentSpread',
                              name: {
                                kind: 'Name',
                                value: 'EpisodeLine_SeasonFragment',
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'SeriesPoster_SeriesFragment' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Series' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'poster' } },
          { kind: 'Field', name: { kind: 'Name', value: 'title' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'SeriesStatusSelect_SeriesFragment' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Series' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'status' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'EpisodeLine_EpisodeFragment' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Episode' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'number' } },
          { kind: 'Field', name: { kind: 'Name', value: 'title' } },
          { kind: 'Field', name: { kind: 'Name', value: 'isSeen' } },
          { kind: 'Field', name: { kind: 'Name', value: 'releasedAt' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'EpisodeLine_SeasonFragment' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Season' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'number' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  SeriesDetailsPageQuery,
  SeriesDetailsPageQueryVariables
>
export const MarkSeasonEpisodesAsSeenDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'markSeasonEpisodesAsSeen' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'input' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'MarkSeasonEpisodesAsSeenInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'markSeasonEpisodesAsSeen' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'input' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'Error' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'message' },
                      },
                    ],
                  },
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'Season' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'episodes' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'isSeen' },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'series' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                            {
                              kind: 'FragmentSpread',
                              name: {
                                kind: 'Name',
                                value: 'LatestSeenEpisodeCell_SeriesFragment',
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'LatestSeenEpisodeCell_SeriesFragment' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Series' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'latestSeenEpisode' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'number' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'season' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'number' },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'nextEpisode' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  MarkSeasonEpisodesAsSeenMutation,
  MarkSeasonEpisodesAsSeenMutationVariables
>
export const LatestSeenEpisodeToggleEpisodeSeenDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'LatestSeenEpisodeToggleEpisodeSeen' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'input' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'ToggleEpisodeSeenInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'toggleEpisodeSeen' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'input' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'Error' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'message' },
                      },
                    ],
                  },
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'Episode' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'isSeen' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'season' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'series' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'id' },
                                  },
                                  {
                                    kind: 'FragmentSpread',
                                    name: {
                                      kind: 'Name',
                                      value:
                                        'LatestSeenEpisodeCell_SeriesFragment',
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'LatestSeenEpisodeCell_SeriesFragment' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Series' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'latestSeenEpisode' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'number' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'season' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'number' },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'nextEpisode' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  LatestSeenEpisodeToggleEpisodeSeenMutation,
  LatestSeenEpisodeToggleEpisodeSeenMutationVariables
>
export const SeriesListDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'seriesList' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'input' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'UserSeriesListInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'userSeriesList' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'input' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'Error' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'message' },
                      },
                    ],
                  },
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'QueryUserSeriesListSuccess' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'data' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'nextEpisode' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'id' },
                                  },
                                ],
                              },
                            },
                            {
                              kind: 'FragmentSpread',
                              name: {
                                kind: 'Name',
                                value: 'SeriesRow_SeriesFragment',
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'SeriesPoster_SeriesFragment' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Series' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'poster' } },
          { kind: 'Field', name: { kind: 'Name', value: 'title' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'LatestSeenEpisodeCell_SeriesFragment' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Series' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'latestSeenEpisode' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'number' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'season' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'number' },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'nextEpisode' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'SeriesRow_SeriesFragment' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Series' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'title' } },
          {
            kind: 'FragmentSpread',
            name: { kind: 'Name', value: 'SeriesPoster_SeriesFragment' },
          },
          {
            kind: 'FragmentSpread',
            name: {
              kind: 'Name',
              value: 'LatestSeenEpisodeCell_SeriesFragment',
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<SeriesListQuery, SeriesListQueryVariables>
export const SeriesUpdateStatusDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'seriesUpdateStatus' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'input' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'SeriesUpdateStatusInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'seriesUpdateStatus' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'input' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'Series' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'status' },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  SeriesUpdateStatusMutation,
  SeriesUpdateStatusMutationVariables
>
export const MarkSeriesEpisodesAsSeenDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'markSeriesEpisodesAsSeen' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'input' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'MarkSeriesEpisodesAsSeenInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'markSeriesEpisodesAsSeen' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'input' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'Error' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'message' },
                      },
                    ],
                  },
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'Series' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'FragmentSpread',
                        name: {
                          kind: 'Name',
                          value: 'LatestSeenEpisodeCell_SeriesFragment',
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'seasons' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'episodes' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'id' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'isSeen' },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'LatestSeenEpisodeCell_SeriesFragment' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Series' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'latestSeenEpisode' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'number' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'season' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'number' },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'nextEpisode' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  MarkSeriesEpisodesAsSeenMutation,
  MarkSeriesEpisodesAsSeenMutationVariables
>
