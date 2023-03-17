import { type CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: './src/schema.ts',
  documents: ['src/**/*.ts'],
  generates: {
    './src/generated/gql/': {
      preset: 'client-preset',
    },
  },
  emitLegacyCommonJSImports: false,
  require: 'ts-node/esm/transpile-only',
  hooks: {
    afterAllFileWrite: ['npx eslint --fix'],
  },
}

export default config
