import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: 'http://localhost:4000/graphql',
  documents: ['src/**/*.tsx', 'src/**/*.ts'],
  generates: {
    'src/generated/gql/': {
      preset: 'client',
    },
  },
  hooks: {
    afterAllFileWrite: ['npx eslint --fix'],
  },
}

export default config
