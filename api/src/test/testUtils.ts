import { type TypedDocumentNode } from '@graphql-typed-document-node/core'
import { type ExecutionResult, print } from 'graphql'
import { createYoga, type YogaInitialContext } from 'graphql-yoga'
import { type Selectable } from 'kysely'

import { episodeFactory, seasonFactory, seriesFactory } from '@/features/series'
import { seenEpisodeFactory } from '@/features/seriesProgress'
import { userFactory } from '@/features/users'
import {
  type User,
  type Episode,
  type Season,
  type Series,
} from '@/generated/db'
import { createArrayOfLength } from '@/lib/createArrayOfLength'
import { db } from '@/lib/db'
import { schema } from '@/schema'
import { type AuthenticatedContext, type Context } from '@/types/context'
import { type NotWorthIt } from '@/types/utils'

export const createContext = <T extends Context['currentUser']>({
  ctx = {},
  currentUser,
}: {
  ctx?: Partial<YogaInitialContext>
  currentUser?: T
} = {}): T extends undefined ? Context : AuthenticatedContext =>
  ({
    params: {},
    // We can't really create the Fastify request and reply objects on their
    // own, so we only mock the fields that we need from them
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    req: null as NotWorthIt,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    reply: {
      setCookie: vi.fn(),
    } as NotWorthIt,
    ...ctx,
    db,
    currentUser,
  } as T extends undefined ? Context : AuthenticatedContext)

/**
 * A helper for making fully typed GraphQL requests in tests.
 *
 * https://the-guild.dev/graphql/codegen/docs/guides/api-testing
 */
export async function executeOperation<TResult, TVariables>(
  params: {
    operation: TypedDocumentNode<TResult, TVariables>
    /**
     * The authenticated user. Set to `null` to be logged out. If undefined, a new
     * user will be created.
     */
    user?: Context['currentUser'] | null
  } & (TVariables extends Record<string, never>
    ? unknown
    : // Only add the variables field if there are any. Setting to `undefined`
      // still requires giving the key.
      { variables: TVariables }),
): Promise<ExecutionResult<TResult>> {
  const { operation, user } = params

  const authenticatedUser =
    user === undefined ? await userFactory.create() : user

  // create a separate Yoga instance for tests so that we can customize the ctx
  const yoga = createYoga({
    schema,
    context: (ctx) =>
      createContext({
        ctx,
        currentUser: authenticatedUser ?? undefined,
      }),
  })

  const response = await Promise.resolve(
    yoga.fetch('http://yoga/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        query: print(operation),
        variables: 'variables' in params ? params.variables : undefined,
      }),
    }),
  )

  return (await response.json()) as ExecutionResult<TResult>
}

const graphqlErrors = [
  'BaseError',
  'InvalidInputError',
  'UnauthorizedError',
  'NotFoundError',
] as const
type GraphqlErrors = (typeof graphqlErrors)[number]

/**
 * If the returned data is an error, throw an exception. Otherwise, return the
 * data with the correct type set.
 *
 * This is necessary when the API returns unions with errors in responses as
 * otherwise, we'd need to add a bunch of `if` statements in tests to satisfy
 * TypeScript.
 *
 * @example
 * ```ts
 * const result = await executeOperation(graphql(`...`))
 * // result.data.query type is User | InvalidInputError
 *
 * const resultUser = await checkErrors(result.data.query)
 * // If the result was InvalidInputError, an exception is thrown
 * // resultUser is typed as User
 *
 * // No type error below!
 * expect(resultUser.id).toBeTruthy()
 * ```
 */
export const checkErrors = <T extends { __typename: string | GraphqlErrors }>(
  result: T | undefined,
) => {
  if (!result) {
    throw new Error('Expected result to not be undefined.')
  }

  graphqlErrors.forEach((error) => {
    if (result.__typename === error) {
      throw new Error(
        `Expected to not receive a ${error}: ${JSON.stringify(result)}.`,
      )
    }
  })

  return result as Exclude<T, { __typename: GraphqlErrors }>
}

/**
 * Similarly to `checkErrors`, this function allows extracting an error from the
 * GraphQL response in tests so that it has the correct type.
 */
export const expectErrors = <
  ErrorKey extends GraphqlErrors,
  T extends { __typename: ErrorKey | string },
>(
  result: T | undefined,
) => {
  if (!result) {
    throw new Error('Expected result to not be undefined.')
  }

  const error = graphqlErrors.find((e) => result.__typename === e)
  if (!error) {
    throw new Error(`Expected to have an error, got ${JSON.stringify(result)}.`)
  }

  return result as Extract<T, { __typename: ErrorKey }>
}

/**
 * Create series, seasons, and episodes in the database for testing.
 * @param seasonEpisodesCount A list of seasons with the number of episodes
 * to create.
 */
export const createSeriesWithEpisodesAndSeasons = async (
  seasonEpisodesCount: number[],
): Promise<{
  series: Selectable<Series>
  seasons: {
    season: Selectable<Season>
    episodes: Selectable<Episode>[]
  }[]
}> => {
  const series = await seriesFactory.create()

  const seasons = await Promise.all(
    seasonEpisodesCount.map(async (episodesCount, seasonIndex) => {
      const season = await seasonFactory.create({
        seriesId: series.id,
        number: seasonIndex + 1,
      })
      const episodes = await Promise.all(
        createArrayOfLength(episodesCount).map((_, index) => {
          return episodeFactory.create({
            seasonId: season.id,
            number: index + 1,
          })
        }),
      )

      return {
        season,
        episodes,
      }
    }),
  )

  return { series, seasons }
}

/**
 * A helper to create multiple seen episodes in the db for the user.
 */
export const createSeenEpisodesForUser = async (
  episodeIds: number[],
  user?: Selectable<User>,
) => {
  const usedUser = user ?? (await userFactory.create())

  const seenEpisodes = await Promise.all(
    episodeIds.map((episodeId) =>
      seenEpisodeFactory.create({
        episodeId: episodeId,
        userId: usedUser.id,
      }),
    ),
  )

  return {
    user: usedUser,
    seenEpisodes,
  }
}
