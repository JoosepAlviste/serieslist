import { type BuildOptions, build } from 'esbuild'

type EsbuildOptions = BuildOptions & {
  /**
   * Whole package.json file, import with
   * ```typescript
   * import packageJson from './package.json'
   * ```
   */
  packageJson: {
    dependencies: Record<string, string>
    devDependencies: Record<string, string>
  }
}

/**
 * Build options for compiling TypeScript for Node with esbuild.
 */
const buildEsbuildConfig = ({
  packageJson,
  ...options
}: EsbuildOptions): BuildOptions => {
  const { external = [], ...optionsWithoutExternal } = options

  const packages = Object.keys(packageJson.dependencies)
    .concat(Object.keys(packageJson.devDependencies))
    .filter((name) => !name.startsWith('@serieslist'))

  return {
    outdir: 'dist',
    platform: 'node',
    target: 'esnext',
    format: 'esm',
    bundle: true,
    tsconfig: 'tsconfig.json',
    external: [...packages, ...external],
    banner: {
      // require does not exist in ESM, but some packages that are using require
      // are bundled into `dist/` and esbuild does not convert requires to
      // imports. This snippets creates a new `require` function that's used in
      // the bundle.
      // https://github.com/evanw/esbuild/issues/1921#issuecomment-1152991694
      js: "import { createRequire } from 'module'; const require = createRequire(import.meta.url);",
    },
    ...optionsWithoutExternal,
  }
}

export const buildEsbuild = async (options: EsbuildOptions) => {
  return await build(buildEsbuildConfig(options))
}
