/// <reference types="vite/client" />

/// <reference types="vite-plugin-svgr/client" />

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface ImportMetaEnv {
  readonly VITE_API_URL?: string
  readonly VITE_API_INTERNAL_URL?: string
  readonly VITE_APP_PORT?: string
  readonly VITE_APP_SENTRY_DSN?: string
}

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface ImportMeta {
  readonly env: ImportMetaEnv
}
