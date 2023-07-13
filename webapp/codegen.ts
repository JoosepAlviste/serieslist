import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: 'http://localhost:4000/graphql',
  documents: ['src/**/*.tsx', 'src/**/*.ts'],
  generates: {
    'src/generated/gql/': {
      preset: 'client',
      config: {
        nonOptionalTypename: true,
        scalars: {
          Date: 'string',
        },
      },
    },
  },
  hooks: {
    afterAllFileWrite: ['pnpm exec eslint --fix'],
  },
}

export default config
