/* eslint-disable */
import * as types from './graphql';
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
    "\n      mutation login($input: LoginInput!) {\n        login(input: $input) {\n          __typename\n          ... on User {\n            id\n            email\n          }\n          ... on InvalidInputError {\n            fieldErrors {\n              path\n              message\n            }\n            message\n          }\n        }\n      }\n    ": types.LoginDocument,
    "\n      mutation register($input: RegisterInput!) {\n        register(input: $input) {\n          __typename\n          ... on User {\n            id\n            email\n          }\n          ... on InvalidInputError {\n            fieldErrors {\n              path\n              message\n            }\n            message\n          }\n        }\n      }\n    ": types.RegisterDocument,
    "\n      query currentUser {\n        me {\n          __typename\n          ... on User {\n            id\n            email\n            name\n          }\n        }\n      }\n    ": types.CurrentUserDocument,
    "\n      mutation logOut {\n        logOut\n      }\n    ": types.LogOutDocument,
    "\n  query search($input: SeriesSearchInput!) {\n    seriesSearch(input: $input) {\n      id\n      imdbId\n      title\n      startYear\n      endYear\n      ...SeriesPoster_SeriesFragment\n    }\n  }\n": types.SearchDocument,
    "\n  fragment EpisodeLine_EpisodeFragment on Episode {\n    id\n    number\n    title\n    isSeen\n  }\n": types.EpisodeLine_EpisodeFragmentFragmentDoc,
    "\n  fragment EpisodeLine_SeasonFragment on Season {\n    number\n  }\n": types.EpisodeLine_SeasonFragmentFragmentDoc,
    "\n      mutation toggleEpisodeSeen($input: ToggleEpisodeSeenInput!) {\n        toggleEpisodeSeen(input: $input) {\n          __typename\n          ... on Error {\n            message\n          }\n          ... on Episode {\n            id\n            isSeen\n          }\n        }\n      }\n    ": types.ToggleEpisodeSeenDocument,
    "\n      query seriesDetailsPage($id: ID!) {\n        series(id: $id) {\n          __typename\n          ... on NotFoundError {\n            message\n          }\n          ... on Series {\n            id\n            imdbId\n            title\n            startYear\n            endYear\n            plot\n            ...SeriesPoster_SeriesFragment\n            ...SeriesStatusSelect_SeriesFragment\n            seasons {\n              id\n              number\n              episodes {\n                id\n                ...EpisodeLine_EpisodeFragment\n              }\n              ...EpisodeLine_SeasonFragment\n            }\n          }\n        }\n      }\n    ": types.SeriesDetailsPageDocument,
    "\n  fragment SeriesPoster_SeriesFragment on Series {\n    poster\n    title\n  }\n": types.SeriesPoster_SeriesFragmentFragmentDoc,
    "\n  fragment SeriesStatusSelect_SeriesFragment on Series {\n    id\n    status\n  }\n": types.SeriesStatusSelect_SeriesFragmentFragmentDoc,
    "\n      mutation seriesUpdateStatus($input: SeriesUpdateStatusInput!) {\n        seriesUpdateStatus(input: $input) {\n          __typename\n          ... on Series {\n            id\n            status\n          }\n        }\n      }\n    ": types.SeriesUpdateStatusDocument,
    "\n      query aboutPage {\n        me {\n          __typename\n          ... on User {\n            id\n            email\n          }\n        }\n      }\n    ": types.AboutPageDocument,
    "\n      query indexPage {\n        hello\n      }\n    ": types.IndexPageDocument,
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
export function graphql(source: "\n      mutation login($input: LoginInput!) {\n        login(input: $input) {\n          __typename\n          ... on User {\n            id\n            email\n          }\n          ... on InvalidInputError {\n            fieldErrors {\n              path\n              message\n            }\n            message\n          }\n        }\n      }\n    "): (typeof documents)["\n      mutation login($input: LoginInput!) {\n        login(input: $input) {\n          __typename\n          ... on User {\n            id\n            email\n          }\n          ... on InvalidInputError {\n            fieldErrors {\n              path\n              message\n            }\n            message\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      mutation register($input: RegisterInput!) {\n        register(input: $input) {\n          __typename\n          ... on User {\n            id\n            email\n          }\n          ... on InvalidInputError {\n            fieldErrors {\n              path\n              message\n            }\n            message\n          }\n        }\n      }\n    "): (typeof documents)["\n      mutation register($input: RegisterInput!) {\n        register(input: $input) {\n          __typename\n          ... on User {\n            id\n            email\n          }\n          ... on InvalidInputError {\n            fieldErrors {\n              path\n              message\n            }\n            message\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query currentUser {\n        me {\n          __typename\n          ... on User {\n            id\n            email\n            name\n          }\n        }\n      }\n    "): (typeof documents)["\n      query currentUser {\n        me {\n          __typename\n          ... on User {\n            id\n            email\n            name\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      mutation logOut {\n        logOut\n      }\n    "): (typeof documents)["\n      mutation logOut {\n        logOut\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query search($input: SeriesSearchInput!) {\n    seriesSearch(input: $input) {\n      id\n      imdbId\n      title\n      startYear\n      endYear\n      ...SeriesPoster_SeriesFragment\n    }\n  }\n"): (typeof documents)["\n  query search($input: SeriesSearchInput!) {\n    seriesSearch(input: $input) {\n      id\n      imdbId\n      title\n      startYear\n      endYear\n      ...SeriesPoster_SeriesFragment\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment EpisodeLine_EpisodeFragment on Episode {\n    id\n    number\n    title\n    isSeen\n  }\n"): (typeof documents)["\n  fragment EpisodeLine_EpisodeFragment on Episode {\n    id\n    number\n    title\n    isSeen\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment EpisodeLine_SeasonFragment on Season {\n    number\n  }\n"): (typeof documents)["\n  fragment EpisodeLine_SeasonFragment on Season {\n    number\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      mutation toggleEpisodeSeen($input: ToggleEpisodeSeenInput!) {\n        toggleEpisodeSeen(input: $input) {\n          __typename\n          ... on Error {\n            message\n          }\n          ... on Episode {\n            id\n            isSeen\n          }\n        }\n      }\n    "): (typeof documents)["\n      mutation toggleEpisodeSeen($input: ToggleEpisodeSeenInput!) {\n        toggleEpisodeSeen(input: $input) {\n          __typename\n          ... on Error {\n            message\n          }\n          ... on Episode {\n            id\n            isSeen\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query seriesDetailsPage($id: ID!) {\n        series(id: $id) {\n          __typename\n          ... on NotFoundError {\n            message\n          }\n          ... on Series {\n            id\n            imdbId\n            title\n            startYear\n            endYear\n            plot\n            ...SeriesPoster_SeriesFragment\n            ...SeriesStatusSelect_SeriesFragment\n            seasons {\n              id\n              number\n              episodes {\n                id\n                ...EpisodeLine_EpisodeFragment\n              }\n              ...EpisodeLine_SeasonFragment\n            }\n          }\n        }\n      }\n    "): (typeof documents)["\n      query seriesDetailsPage($id: ID!) {\n        series(id: $id) {\n          __typename\n          ... on NotFoundError {\n            message\n          }\n          ... on Series {\n            id\n            imdbId\n            title\n            startYear\n            endYear\n            plot\n            ...SeriesPoster_SeriesFragment\n            ...SeriesStatusSelect_SeriesFragment\n            seasons {\n              id\n              number\n              episodes {\n                id\n                ...EpisodeLine_EpisodeFragment\n              }\n              ...EpisodeLine_SeasonFragment\n            }\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment SeriesPoster_SeriesFragment on Series {\n    poster\n    title\n  }\n"): (typeof documents)["\n  fragment SeriesPoster_SeriesFragment on Series {\n    poster\n    title\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment SeriesStatusSelect_SeriesFragment on Series {\n    id\n    status\n  }\n"): (typeof documents)["\n  fragment SeriesStatusSelect_SeriesFragment on Series {\n    id\n    status\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      mutation seriesUpdateStatus($input: SeriesUpdateStatusInput!) {\n        seriesUpdateStatus(input: $input) {\n          __typename\n          ... on Series {\n            id\n            status\n          }\n        }\n      }\n    "): (typeof documents)["\n      mutation seriesUpdateStatus($input: SeriesUpdateStatusInput!) {\n        seriesUpdateStatus(input: $input) {\n          __typename\n          ... on Series {\n            id\n            status\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query aboutPage {\n        me {\n          __typename\n          ... on User {\n            id\n            email\n          }\n        }\n      }\n    "): (typeof documents)["\n      query aboutPage {\n        me {\n          __typename\n          ... on User {\n            id\n            email\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query indexPage {\n        hello\n      }\n    "): (typeof documents)["\n      query indexPage {\n        hello\n      }\n    "];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;