import { Factory } from 'fishery'

import { type User } from '@/generated/gql/graphql'
import { type RequiredFields } from '@/types/utils'

export const userFactory = Factory.define<RequiredFields<User, '__typename'>>(
  ({ sequence }) => ({
    __typename: 'User',
    id: String(sequence),
    name: 'Test Dude',
    email: 'test@dude.com',
  }),
)
