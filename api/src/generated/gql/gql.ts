/* eslint-disable */
import * as types from './graphql.js';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n        query HelloQuery {\n          hello\n        }\n      ": types.HelloQueryDocument,
    "\n          mutation register($input: RegisterInput!) {\n            register(input: $input) {\n              __typename\n              ... on User {\n                id\n                name\n                email\n              }\n              ... on InvalidInputError {\n                fieldErrors {\n                  path\n                  message\n                }\n              }\n            }\n          }\n        ": types.RegisterDocument,
    "\n          mutation login($input: LoginInput!) {\n            login(input: $input) {\n              __typename\n              ... on User {\n                id\n                name\n                email\n              }\n              ... on InvalidInputError {\n                fieldErrors {\n                  path\n                  message\n                }\n              }\n            }\n          }\n        ": types.LoginDocument,
    "\n          query me {\n            me {\n              __typename\n              ... on User {\n                id\n                name\n                email\n              }\n              ... on UnauthorizedError {\n                message\n              }\n            }\n          }\n        ": types.MeDocument,
    "\n          query seriesSearch($input: SeriesSearchInput!) {\n            seriesSearch(input: $input) {\n              id\n              title\n              imdbId\n              poster\n              startYear\n              endYear\n            }\n          }\n        ": types.SeriesSearchDocument,
    "\n          query series($id: ID!) {\n            series(id: $id) {\n              __typename\n              ... on Series {\n                id\n                title\n                seasons {\n                  id\n                  episodes {\n                    id\n                  }\n                }\n              }\n              ... on NotFoundError {\n                message\n              }\n            }\n          }\n        ": types.SeriesDocument,
    "\n          query seriesSchemaUserSeriesList($input: UserSeriesListInput!) {\n            userSeriesList(input: $input) {\n              __typename\n              ... on Error {\n                message\n              }\n              ... on QueryUserSeriesListSuccess {\n                data {\n                  id\n                }\n              }\n            }\n          }\n        ": types.SeriesSchemaUserSeriesListDocument,
    "\n          query seriesTypeSeries($id: ID!) {\n            series(id: $id) {\n              __typename\n              ... on Series {\n                seasons {\n                  id\n                  number\n                }\n              }\n            }\n          }\n        ": types.SeriesTypeSeriesDocument,
    "\n          query seriesTypeSeriesEpisodes($id: ID!) {\n            series(id: $id) {\n              __typename\n              ... on Series {\n                seasons {\n                  episodes {\n                    id\n                    imdbId\n                    number\n                    title\n                    imdbRating\n                    releasedAt\n                  }\n                }\n              }\n            }\n          }\n        ": types.SeriesTypeSeriesEpisodesDocument,
    "\n          query seriesTypeSeriesStatus($id: ID!) {\n            series(id: $id) {\n              __typename\n              ... on Series {\n                status\n              }\n            }\n          }\n        ": types.SeriesTypeSeriesStatusDocument,
    "\n          query episodeTypeSeason($id: ID!) {\n            series(id: $id) {\n              __typename\n              ... on Series {\n                seasons {\n                  id\n                  episodes {\n                    id\n                    season {\n                      id\n                    }\n                  }\n                }\n              }\n            }\n          }\n        ": types.EpisodeTypeSeasonDocument,
    "\n          mutation seriesUpdateStatus($input: SeriesUpdateStatusInput!) {\n            seriesUpdateStatus(input: $input) {\n              __typename\n            }\n          }\n        ": types.SeriesUpdateStatusDocument,
    "\n          mutation toggleEpisodeSeen($input: ToggleEpisodeSeenInput!) {\n            toggleEpisodeSeen(input: $input) {\n              __typename\n              ... on Error {\n                message\n              }\n              ... on Episode {\n                id\n              }\n            }\n          }\n        ": types.ToggleEpisodeSeenDocument,
    "\n          mutation markSeasonEpisodesAsSeen(\n            $input: MarkSeasonEpisodesAsSeenInput!\n          ) {\n            markSeasonEpisodesAsSeen(input: $input) {\n              __typename\n              ... on Season {\n                episodes {\n                  id\n                  isSeen\n                }\n              }\n            }\n          }\n        ": types.MarkSeasonEpisodesAsSeenDocument,
    "\n          mutation markSeriesEpisodesAsSeen(\n            $input: MarkSeriesEpisodesAsSeenInput!\n          ) {\n            markSeriesEpisodesAsSeen(input: $input) {\n              __typename\n              ... on Series {\n                id\n              }\n            }\n          }\n        ": types.MarkSeriesEpisodesAsSeenDocument,
    "\n          query seriesProgressEpisode($id: ID!) {\n            series(id: $id) {\n              __typename\n              ... on Series {\n                seasons {\n                  episodes {\n                    id\n                    isSeen\n                  }\n                }\n                latestSeenEpisode {\n                  id\n                }\n                nextEpisode {\n                  id\n                }\n              }\n            }\n          }\n        ": types.SeriesProgressEpisodeDocument,
    "\n          query seriesProgressEpisodeList($input: UserSeriesListInput!) {\n            userSeriesList(input: $input) {\n              __typename\n              ... on QueryUserSeriesListSuccess {\n                data {\n                  id\n                  latestSeenEpisode {\n                    id\n                  }\n                  nextEpisode {\n                    id\n                  }\n                }\n              }\n            }\n          }\n        ": types.SeriesProgressEpisodeListDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n        query HelloQuery {\n          hello\n        }\n      "): (typeof documents)["\n        query HelloQuery {\n          hello\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n          mutation register($input: RegisterInput!) {\n            register(input: $input) {\n              __typename\n              ... on User {\n                id\n                name\n                email\n              }\n              ... on InvalidInputError {\n                fieldErrors {\n                  path\n                  message\n                }\n              }\n            }\n          }\n        "): (typeof documents)["\n          mutation register($input: RegisterInput!) {\n            register(input: $input) {\n              __typename\n              ... on User {\n                id\n                name\n                email\n              }\n              ... on InvalidInputError {\n                fieldErrors {\n                  path\n                  message\n                }\n              }\n            }\n          }\n        "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n          mutation login($input: LoginInput!) {\n            login(input: $input) {\n              __typename\n              ... on User {\n                id\n                name\n                email\n              }\n              ... on InvalidInputError {\n                fieldErrors {\n                  path\n                  message\n                }\n              }\n            }\n          }\n        "): (typeof documents)["\n          mutation login($input: LoginInput!) {\n            login(input: $input) {\n              __typename\n              ... on User {\n                id\n                name\n                email\n              }\n              ... on InvalidInputError {\n                fieldErrors {\n                  path\n                  message\n                }\n              }\n            }\n          }\n        "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n          query me {\n            me {\n              __typename\n              ... on User {\n                id\n                name\n                email\n              }\n              ... on UnauthorizedError {\n                message\n              }\n            }\n          }\n        "): (typeof documents)["\n          query me {\n            me {\n              __typename\n              ... on User {\n                id\n                name\n                email\n              }\n              ... on UnauthorizedError {\n                message\n              }\n            }\n          }\n        "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n          query seriesSearch($input: SeriesSearchInput!) {\n            seriesSearch(input: $input) {\n              id\n              title\n              imdbId\n              poster\n              startYear\n              endYear\n            }\n          }\n        "): (typeof documents)["\n          query seriesSearch($input: SeriesSearchInput!) {\n            seriesSearch(input: $input) {\n              id\n              title\n              imdbId\n              poster\n              startYear\n              endYear\n            }\n          }\n        "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n          query series($id: ID!) {\n            series(id: $id) {\n              __typename\n              ... on Series {\n                id\n                title\n                seasons {\n                  id\n                  episodes {\n                    id\n                  }\n                }\n              }\n              ... on NotFoundError {\n                message\n              }\n            }\n          }\n        "): (typeof documents)["\n          query series($id: ID!) {\n            series(id: $id) {\n              __typename\n              ... on Series {\n                id\n                title\n                seasons {\n                  id\n                  episodes {\n                    id\n                  }\n                }\n              }\n              ... on NotFoundError {\n                message\n              }\n            }\n          }\n        "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n          query seriesSchemaUserSeriesList($input: UserSeriesListInput!) {\n            userSeriesList(input: $input) {\n              __typename\n              ... on Error {\n                message\n              }\n              ... on QueryUserSeriesListSuccess {\n                data {\n                  id\n                }\n              }\n            }\n          }\n        "): (typeof documents)["\n          query seriesSchemaUserSeriesList($input: UserSeriesListInput!) {\n            userSeriesList(input: $input) {\n              __typename\n              ... on Error {\n                message\n              }\n              ... on QueryUserSeriesListSuccess {\n                data {\n                  id\n                }\n              }\n            }\n          }\n        "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n          query seriesTypeSeries($id: ID!) {\n            series(id: $id) {\n              __typename\n              ... on Series {\n                seasons {\n                  id\n                  number\n                }\n              }\n            }\n          }\n        "): (typeof documents)["\n          query seriesTypeSeries($id: ID!) {\n            series(id: $id) {\n              __typename\n              ... on Series {\n                seasons {\n                  id\n                  number\n                }\n              }\n            }\n          }\n        "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n          query seriesTypeSeriesEpisodes($id: ID!) {\n            series(id: $id) {\n              __typename\n              ... on Series {\n                seasons {\n                  episodes {\n                    id\n                    imdbId\n                    number\n                    title\n                    imdbRating\n                    releasedAt\n                  }\n                }\n              }\n            }\n          }\n        "): (typeof documents)["\n          query seriesTypeSeriesEpisodes($id: ID!) {\n            series(id: $id) {\n              __typename\n              ... on Series {\n                seasons {\n                  episodes {\n                    id\n                    imdbId\n                    number\n                    title\n                    imdbRating\n                    releasedAt\n                  }\n                }\n              }\n            }\n          }\n        "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n          query seriesTypeSeriesStatus($id: ID!) {\n            series(id: $id) {\n              __typename\n              ... on Series {\n                status\n              }\n            }\n          }\n        "): (typeof documents)["\n          query seriesTypeSeriesStatus($id: ID!) {\n            series(id: $id) {\n              __typename\n              ... on Series {\n                status\n              }\n            }\n          }\n        "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n          query episodeTypeSeason($id: ID!) {\n            series(id: $id) {\n              __typename\n              ... on Series {\n                seasons {\n                  id\n                  episodes {\n                    id\n                    season {\n                      id\n                    }\n                  }\n                }\n              }\n            }\n          }\n        "): (typeof documents)["\n          query episodeTypeSeason($id: ID!) {\n            series(id: $id) {\n              __typename\n              ... on Series {\n                seasons {\n                  id\n                  episodes {\n                    id\n                    season {\n                      id\n                    }\n                  }\n                }\n              }\n            }\n          }\n        "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n          mutation seriesUpdateStatus($input: SeriesUpdateStatusInput!) {\n            seriesUpdateStatus(input: $input) {\n              __typename\n            }\n          }\n        "): (typeof documents)["\n          mutation seriesUpdateStatus($input: SeriesUpdateStatusInput!) {\n            seriesUpdateStatus(input: $input) {\n              __typename\n            }\n          }\n        "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n          mutation toggleEpisodeSeen($input: ToggleEpisodeSeenInput!) {\n            toggleEpisodeSeen(input: $input) {\n              __typename\n              ... on Error {\n                message\n              }\n              ... on Episode {\n                id\n              }\n            }\n          }\n        "): (typeof documents)["\n          mutation toggleEpisodeSeen($input: ToggleEpisodeSeenInput!) {\n            toggleEpisodeSeen(input: $input) {\n              __typename\n              ... on Error {\n                message\n              }\n              ... on Episode {\n                id\n              }\n            }\n          }\n        "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n          mutation markSeasonEpisodesAsSeen(\n            $input: MarkSeasonEpisodesAsSeenInput!\n          ) {\n            markSeasonEpisodesAsSeen(input: $input) {\n              __typename\n              ... on Season {\n                episodes {\n                  id\n                  isSeen\n                }\n              }\n            }\n          }\n        "): (typeof documents)["\n          mutation markSeasonEpisodesAsSeen(\n            $input: MarkSeasonEpisodesAsSeenInput!\n          ) {\n            markSeasonEpisodesAsSeen(input: $input) {\n              __typename\n              ... on Season {\n                episodes {\n                  id\n                  isSeen\n                }\n              }\n            }\n          }\n        "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n          mutation markSeriesEpisodesAsSeen(\n            $input: MarkSeriesEpisodesAsSeenInput!\n          ) {\n            markSeriesEpisodesAsSeen(input: $input) {\n              __typename\n              ... on Series {\n                id\n              }\n            }\n          }\n        "): (typeof documents)["\n          mutation markSeriesEpisodesAsSeen(\n            $input: MarkSeriesEpisodesAsSeenInput!\n          ) {\n            markSeriesEpisodesAsSeen(input: $input) {\n              __typename\n              ... on Series {\n                id\n              }\n            }\n          }\n        "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n          query seriesProgressEpisode($id: ID!) {\n            series(id: $id) {\n              __typename\n              ... on Series {\n                seasons {\n                  episodes {\n                    id\n                    isSeen\n                  }\n                }\n                latestSeenEpisode {\n                  id\n                }\n                nextEpisode {\n                  id\n                }\n              }\n            }\n          }\n        "): (typeof documents)["\n          query seriesProgressEpisode($id: ID!) {\n            series(id: $id) {\n              __typename\n              ... on Series {\n                seasons {\n                  episodes {\n                    id\n                    isSeen\n                  }\n                }\n                latestSeenEpisode {\n                  id\n                }\n                nextEpisode {\n                  id\n                }\n              }\n            }\n          }\n        "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n          query seriesProgressEpisodeList($input: UserSeriesListInput!) {\n            userSeriesList(input: $input) {\n              __typename\n              ... on QueryUserSeriesListSuccess {\n                data {\n                  id\n                  latestSeenEpisode {\n                    id\n                  }\n                  nextEpisode {\n                    id\n                  }\n                }\n              }\n            }\n          }\n        "): (typeof documents)["\n          query seriesProgressEpisodeList($input: UserSeriesListInput!) {\n            userSeriesList(input: $input) {\n              __typename\n              ... on QueryUserSeriesListSuccess {\n                data {\n                  id\n                  latestSeenEpisode {\n                    id\n                  }\n                  nextEpisode {\n                    id\n                  }\n                }\n              }\n            }\n          }\n        "];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;