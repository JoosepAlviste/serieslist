import fs from 'fs'
import path from 'path'

import { test as baseTest } from '@playwright/test'

import { registerNewUser } from './utils'

// eslint-disable-next-line import/export
export * from '@playwright/test'

// eslint-disable-next-line import/export
export const test = baseTest.extend<object, { workerStorageState: string }>({
  // Use the same storage state for all tests in this worker.
  storageState: ({ workerStorageState }, use) => use(workerStorageState),

  // Authenticate once per worker with a worker-scoped fixture.
  workerStorageState: [
    async ({ browser }, use) => {
      // Use parallelIndex as a unique identifier for each worker.
      const id = test.info().parallelIndex
      const fileName = path.resolve(
        test.info().project.outputDir,
        `.auth/${id}.json`,
      )

      if (fs.existsSync(fileName)) {
        // Reuse existing authentication state if any.
        await use(fileName)
        return
      }

      // Important: make sure we authenticate in a clean environment by unsetting storage state.
      const page = await browser.newPage({ storageState: undefined })

      await registerNewUser(page)

      // End of authentication steps.

      await page.context().storageState({ path: fileName })
      await page.close()
      await use(fileName)
    },
    { scope: 'worker' },
  ],
})
