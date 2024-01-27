import type { RequiredFields } from '@serieslist/type-utils'
import { Factory } from 'fishery'

import type { User } from '#/generated/gql/graphql'

export const userFactory = Factory.define<RequiredFields<User, '__typename'>>(
  ({ sequence }) => ({
    __typename: 'User',
    id: String(sequence),
    name: 'Test Dude',
    email: 'test@dude.com',
  }),
)
