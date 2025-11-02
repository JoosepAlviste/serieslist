import { trace } from '@opentelemetry/api'

export const tracer = trace.getTracer('core-graphql-server')
