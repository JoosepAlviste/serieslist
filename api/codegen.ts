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
  hooks: {
    afterAllFileWrite: ['npx eslint --fix'],
  },
}

export default config
