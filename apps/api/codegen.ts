import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: `http://localhost:${process.env.API_PORT ?? 4000}/graphql`,
  documents: ['src/**/*.ts'],
  generates: {
    './src/generated/gql/': {
      preset: 'client-preset',
      config: {
        useTypeImports: true,
      },
    },
  },
  emitLegacyCommonJSImports: false,
  hooks: {
    afterAllFileWrite: ['npx eslint --fix'],
  },
}

export default config
