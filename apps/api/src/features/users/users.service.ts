import type { InsertUser } from '@serieslist/db'
import type { Context } from '@serieslist/graphql-server'

import * as usersRepository from './user.repository'

export const findOne = (args: {
  ctx: Context
  userId?: number
  email?: string
}) => {
  return usersRepository.findOne(args)
}

export const createOne = (args: { ctx: Context; user: InsertUser }) => {
  return usersRepository.createOne(args)
}
