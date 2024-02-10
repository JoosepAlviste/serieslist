import { seriesFactory, userFactory } from '@serieslist/core-db-factories'
import { createContext } from '@serieslist/core-graphql-server/test'

import { findStatusForSeries } from '../series.service'

describe('findStatusForSeries', () => {
  it('returns null if there is no status for the user', async () => {
    const series = await seriesFactory.create()
    const user = await userFactory.create()

    const status = await findStatusForSeries({
      ctx: createContext({
        currentUser: user,
      }),
      seriesIds: [series.id],
    })

    expect(status[0]).toBeNull()
  })
})
