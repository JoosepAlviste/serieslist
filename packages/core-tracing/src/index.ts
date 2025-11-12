import { FastifyOtelInstrumentation } from '@fastify/otel'
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-proto'
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-proto'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { NodeSDK, metrics, logs } from '@opentelemetry/sdk-node'
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions'

type Environment = 'development' | 'test' | 'production'

const REQUEST_LOG_IGNORE_PATTERNS = [
  /\.(js|ts|tsx|css|css\?direct|pageContext\.json|mjs|svg|svg\?import&react|svg\?import|ico)$/,
  /@react-refresh$/,
  /@vite\/client$/,
  /:client-routing$/,
  /__x00__virtual/,
]

export const createTracing = ({ name }: { name: string }): NodeSDK => {
  const environment = (process.env.NODE_ENV ?? 'production') as Environment

  /* eslint-disable @typescript-eslint/no-non-null-assertion */
  const config = {
    environment,

    tracing: {
      url: process.env.OTEL_ENDPOINT!,
      authToken: process.env.OTEL_AUTH_TOKEN!,
      dataset: process.env.OTEL_DATASET!,
    },
  }
  /* eslint-enabled @typescript-eslint/no-non-null-assertion */

  const headers: Record<string, string> = {
    Authorization: `Bearer ${config.tracing.authToken}`,
    'Dash0-Dataset': config.tracing.dataset,
  }

  const getExporterConfig = (resource: string) => {
    return {
      url: `${config.tracing.url}/v1/${resource}`,
      headers,
    }
  }

  const sdk = new NodeSDK({
    resource: resourceFromAttributes({
      [ATTR_SERVICE_NAME]: name,
      'service.namespace': 'serieslist',
      'deployment.environment.name': config.environment,
    }),
    traceExporter: new OTLPTraceExporter(getExporterConfig('traces')),
    metricReaders: [
      new metrics.PeriodicExportingMetricReader({
        exporter: new OTLPMetricExporter({
          ...getExporterConfig('metrics'),
          temporalityPreference: metrics.AggregationTemporality.DELTA,
        }),
      }),
    ],
    logRecordProcessors: [
      new logs.BatchLogRecordProcessor(
        new OTLPLogExporter(getExporterConfig('logs')),
      ),
    ],
    instrumentations: [
      getNodeAutoInstrumentations({
        '@opentelemetry/instrumentation-http': {
          ignoreIncomingRequestHook: (request) => {
            return REQUEST_LOG_IGNORE_PATTERNS.some((pattern) =>
              request.url?.match(pattern),
            )
          },
        },
      }),
      new FastifyOtelInstrumentation({ registerOnInitialization: true }),
    ],
  })

  return sdk
}
