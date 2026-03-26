import type { InsertUser } from '@serieslist/core-db'
import type { Context, DBContext } from '@serieslist/core-graphql-server'

import * as usersRepository from './user.repository'

export const findOne = (args: {
  ctx: DBContext
  userId?: number
  email?: string
  integrationsToken?: string
}) => {
  return usersRepository.findOne(args)
}

export const createOne = (args: { ctx: Context; user: InsertUser }) => {
  return usersRepository.createOne(args)
}

export const updateIntegrationsToken = (
  ...args: Parameters<typeof usersRepository.updateIntegrationsToken>
) => {
  return usersRepository.updateIntegrationsToken(...args)
}
