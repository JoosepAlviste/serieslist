import { type InsertObject } from 'kysely'

import { type DB } from '@/generated/db'
import { type Context } from '@/types/context'

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
