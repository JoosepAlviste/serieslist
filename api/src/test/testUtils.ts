import { buildHTTPExecutor } from '@graphql-tools/executor-http'
import { yoga } from '@/server'

export const executor = buildHTTPExecutor({
  // .bind because of @typescript-eslint/unbound-method
  fetch: yoga.fetch.bind(undefined),
})
