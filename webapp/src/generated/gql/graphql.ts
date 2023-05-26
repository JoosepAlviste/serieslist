/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A local date string (i.e., with no associated timezone) in `YYYY-MM-DD` format, e.g. `2020-01-01`. */
  Date: string;
};

export type BaseError = Error & {
  __typename: 'BaseError';
  message: Scalars['String'];
};

export type Episode = {
  __typename: 'Episode';
  id: Scalars['ID'];
  imdbId: Scalars['String'];
  imdbRating?: Maybe<Scalars['Float']>;
  number: Scalars['Int'];
  releasedAt?: Maybe<Scalars['Date']>;
  title: Scalars['String'];
};

export type Error = {
  message: Scalars['String'];
};

export type InvalidInputError = Error & {
  __typename: 'InvalidInputError';
  fieldErrors: Array<InvalidInputErrorField>;
  message: Scalars['String'];
};

export type InvalidInputErrorField = {
  __typename: 'InvalidInputErrorField';
  message: Scalars['String'];
  path: Array<Scalars['String']>;
};

export type LoginInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type Mutation = {
  __typename: 'Mutation';
  logOut: Scalars['Boolean'];
  login: MutationLoginResult;
  register: MutationRegisterResult;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationRegisterArgs = {
  input: RegisterInput;
};

export type MutationLoginResult = InvalidInputError | User;

export type MutationRegisterResult = InvalidInputError | User;

export type NotFoundError = Error & {
  __typename: 'NotFoundError';
  message: Scalars['String'];
};

export type Query = {
  __typename: 'Query';
  hello: Scalars['String'];
  me: QueryMeResult;
  series: QuerySeriesResult;
  seriesSearch: Array<Series>;
};


export type QueryHelloArgs = {
  name?: InputMaybe<Scalars['String']>;
};


export type QuerySeriesArgs = {
  id: Scalars['ID'];
};


export type QuerySeriesSearchArgs = {
  input: SeriesSearchInput;
};

export type QueryMeResult = UnauthorizedError | User;

export type QuerySeriesResult = NotFoundError | Series;

export type RegisterInput = {
  email: Scalars['String'];
  name: Scalars['String'];
  password: Scalars['String'];
};

export type Season = {
  __typename: 'Season';
  episodes: Array<Episode>;
  id: Scalars['ID'];
  number: Scalars['Int'];
};

export type Series = {
  __typename: 'Series';
  endYear?: Maybe<Scalars['Int']>;
  id: Scalars['ID'];
  imdbId: Scalars['String'];
  plot?: Maybe<Scalars['String']>;
  poster?: Maybe<Scalars['String']>;
  seasons: Array<Season>;
  startYear: Scalars['Int'];
  title: Scalars['String'];
};

export type SeriesSearchInput = {
  keyword: Scalars['String'];
};

export type UnauthorizedError = Error & {
  __typename: 'UnauthorizedError';
  message: Scalars['String'];
};

export type User = {
  __typename: 'User';
  email: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { __typename: 'Mutation', login: { __typename: 'InvalidInputError', message: string, fieldErrors: Array<{ __typename: 'InvalidInputErrorField', path: Array<string>, message: string }> } | { __typename: 'User', id: string, email: string } };

export type RegisterMutationVariables = Exact<{
  input: RegisterInput;
}>;


export type RegisterMutation = { __typename: 'Mutation', register: { __typename: 'InvalidInputError', message: string, fieldErrors: Array<{ __typename: 'InvalidInputErrorField', path: Array<string>, message: string }> } | { __typename: 'User', id: string, email: string } };

export type CurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserQuery = { __typename: 'Query', me: { __typename: 'UnauthorizedError' } | { __typename: 'User', id: string, email: string, name: string } };

export type LogOutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogOutMutation = { __typename: 'Mutation', logOut: boolean };

export type SearchQueryVariables = Exact<{
  input: SeriesSearchInput;
}>;


export type SearchQuery = { __typename: 'Query', seriesSearch: Array<(
    { __typename: 'Series', id: string, imdbId: string, title: string, startYear: number, endYear?: number | null }
    & { ' $fragmentRefs'?: { 'SeriesPoster_SeriesFragmentFragment': SeriesPoster_SeriesFragmentFragment } }
  )> };

export type SeriesDetailsPageQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type SeriesDetailsPageQuery = { __typename: 'Query', series: { __typename: 'NotFoundError', message: string } | (
    { __typename: 'Series', id: string, imdbId: string, title: string, startYear: number, endYear?: number | null, plot?: string | null, seasons: Array<{ __typename: 'Season', id: string, number: number, episodes: Array<{ __typename: 'Episode', id: string, imdbId: string, number: number, title: string, releasedAt?: string | null, imdbRating?: number | null }> }> }
    & { ' $fragmentRefs'?: { 'SeriesPoster_SeriesFragmentFragment': SeriesPoster_SeriesFragmentFragment } }
  ) };

export type SeriesPoster_SeriesFragmentFragment = { __typename: 'Series', poster?: string | null, title: string } & { ' $fragmentName'?: 'SeriesPoster_SeriesFragmentFragment' };

export type AboutPageQueryVariables = Exact<{ [key: string]: never; }>;


export type AboutPageQuery = { __typename: 'Query', me: { __typename: 'UnauthorizedError' } | { __typename: 'User', id: string, email: string } };

export type IndexPageQueryVariables = Exact<{ [key: string]: never; }>;


export type IndexPageQuery = { __typename: 'Query', hello: string };

export const SeriesPoster_SeriesFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SeriesPoster_SeriesFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Series"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"poster"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]} as unknown as DocumentNode<SeriesPoster_SeriesFragmentFragment, unknown>;
export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LoginInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InvalidInputError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fieldErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const RegisterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"register"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RegisterInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"register"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InvalidInputError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fieldErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<RegisterMutation, RegisterMutationVariables>;
export const CurrentUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"currentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<CurrentUserQuery, CurrentUserQueryVariables>;
export const LogOutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"logOut"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logOut"}}]}}]} as unknown as DocumentNode<LogOutMutation, LogOutMutationVariables>;
export const SearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"search"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SeriesSearchInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"seriesSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"imdbId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"startYear"}},{"kind":"Field","name":{"kind":"Name","value":"endYear"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"SeriesPoster_SeriesFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SeriesPoster_SeriesFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Series"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"poster"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]} as unknown as DocumentNode<SearchQuery, SearchQueryVariables>;
export const SeriesDetailsPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"seriesDetailsPage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"series"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotFoundError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Series"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"imdbId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"startYear"}},{"kind":"Field","name":{"kind":"Name","value":"endYear"}},{"kind":"Field","name":{"kind":"Name","value":"plot"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"SeriesPoster_SeriesFragment"}},{"kind":"Field","name":{"kind":"Name","value":"seasons"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"episodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"imdbId"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"releasedAt"}},{"kind":"Field","name":{"kind":"Name","value":"imdbRating"}}]}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SeriesPoster_SeriesFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Series"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"poster"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]} as unknown as DocumentNode<SeriesDetailsPageQuery, SeriesDetailsPageQueryVariables>;
export const AboutPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"aboutPage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]}}]} as unknown as DocumentNode<AboutPageQuery, AboutPageQueryVariables>;
export const IndexPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"indexPage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hello"}}]}}]} as unknown as DocumentNode<IndexPageQuery, IndexPageQueryVariables>;