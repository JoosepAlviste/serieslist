import { register } from 'module'

import { createTracing } from '@serieslist/core-tracing'
import { createAddHookMessageChannel } from 'import-in-the-middle'

// @ts-expect-error Need extension when running with `tsx --import`
import { config } from './config.ts'

const { registerOptions, waitForAllMessagesAcknowledged } =
  createAddHookMessageChannel()
register('import-in-the-middle/hook.mjs', import.meta.url, registerOptions)

const sdk = createTracing({ name: 'api' })

if (config.tracing.enabled) {
  sdk.start()
}

await waitForAllMessagesAcknowledged()
