import { register } from 'module'

import { createTracing } from '@serieslist/core-tracing'
import { createAddHookMessageChannel } from 'import-in-the-middle'

// @ts-expect-error Need extension when running with `tsx --import`
import { config } from '../config.ts'

const { registerOptions, waitForAllMessagesAcknowledged } =
  createAddHookMessageChannel()
register('import-in-the-middle/hook.mjs', import.meta.url, registerOptions)

if (config.tracing.enabled) {
  const sdk = createTracing({ name: 'webapp-server' })

  sdk.start()
}

await waitForAllMessagesAcknowledged()
