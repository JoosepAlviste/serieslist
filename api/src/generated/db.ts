import type { ColumnType } from 'kysely'

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>

export type Timestamp = ColumnType<Date, Date | string, Date | string>

export type Session = {
  token: string
  userId: number | null
  ip: string | null
  userAgent: string | null
  isValid: Generated<boolean | null>
  createdAt: Generated<Timestamp>
  updatedAt: Generated<Timestamp>
}

export type User = {
  id: Generated<number>
  name: string
  email: string
  isAdmin: Generated<boolean | null>
  password: string
  createdAt: Generated<Timestamp>
  updatedAt: Generated<Timestamp>
}

export type DB = {
  session: Session
  user: User
}
