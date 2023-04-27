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
export function graphql(source: "\n      query aboutPage {\n        me {\n          __typename\n          ... on User {\n            id\n            email\n          }\n        }\n      }\n    "): (typeof documents)["\n      query aboutPage {\n        me {\n          __typename\n          ... on User {\n            id\n            email\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query indexPage {\n        hello\n      }\n    "): (typeof documents)["\n      query indexPage {\n        hello\n      }\n    "];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;