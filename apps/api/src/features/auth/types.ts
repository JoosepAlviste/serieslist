export type AccessTokenPayload = {
  sessionToken: string
  userId: number
}

export type RefreshTokenPayload = {
  sessionToken: string
}
