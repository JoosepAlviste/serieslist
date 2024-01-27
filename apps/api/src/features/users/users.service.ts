import { type DB } from '@serieslist/db'
import { type Context } from '@serieslist/graphql-server'
import { type InsertObject } from 'kysely'

import * as usersRepository from './user.repository'

export const findOne = (args: {
  ctx: Context
  userId?: number
  email?: string
}) => {
  return usersRepository.findOne(args)
}

export const createOne = (args: {
  ctx: Context
  user: InsertObject<DB, 'user'>
}) => {
  return usersRepository.createOne(args)
}
