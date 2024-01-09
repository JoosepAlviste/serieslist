import { join } from 'path'

import type { CodegenConfig } from '@graphql-codegen/cli'

const dirname = new URL('.', import.meta.url).pathname
const schema = join(dirname, '..', 'api', 'src', 'generated', 'schema.graphql')

const config: CodegenConfig = {
  overwrite: true,
  schema,
  documents: ['src/**/*.tsx', 'src/**/*.ts'],
  generates: {
    'src/generated/gql/': {
      preset: 'client',
      config: {
        nonOptionalTypename: true,
        useTypeImports: true,
        scalars: {
          Date: 'string',
        },
      },
    },
  },
  hooks: {
    afterAllFileWrite: ['pnpm exec prettier --write src/generated/gql'],
  },
}

export default config
