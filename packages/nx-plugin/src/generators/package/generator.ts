import { join } from 'path'

import { formatFiles, generateFiles, type Tree } from '@nx/devkit'

import { type PackageGeneratorSchema } from './schema'

export async function packageGenerator(
  tree: Tree,
  options: PackageGeneratorSchema,
) {
  const projectRoot = `packages/${options.name}`
  generateFiles(tree, join(__dirname, 'files'), projectRoot, options)
  await formatFiles(tree)
}

export default packageGenerator
