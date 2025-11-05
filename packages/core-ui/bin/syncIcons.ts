/**
 * Execute this script with
 * ```sh
 * FIGMA_TOKEN=your_token pnpm run sync-icons
 * ```
 *
 * The Figma token is a personal access token with "Read-only" access for "File
 * content".
 *
 * https://medium.com/iadvize-engineering/using-figma-api-to-extract-illustrations-and-icons-34e0c7c230fa
 */

import { mkdir, writeFile, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { transform } from '@svgr/core'
import { z } from 'zod'

import { SVG_COLOR_VAR } from '../src/simpleCssVariables'

const dirname = fileURLToPath(new URL('.', import.meta.url))

const FIGMA_TOKEN = process.env.FIGMA_TOKEN
if (!FIGMA_TOKEN) {
  throw new Error('FIGMA_TOKEN environment variable is not defined')
}
const ICONS_DIR = join(dirname, '..', 'src', 'generated', 'icons')
const FIGMA_FILE_ID = 'C4IypV2MWhjqWxwyueDdeo'

const baseFigmaNodeSchema = z.object({
  id: z.string(),
  type: z.string(),
  name: z.string(),
})
type FigmaNode = z.infer<typeof baseFigmaNodeSchema> & {
  children: FigmaNode[]
}
const figmaNodeSchema: z.ZodType<FigmaNode> = baseFigmaNodeSchema.extend({
  children: z.lazy(() => figmaNodeSchema.array()),
})

const figmaFileResponseSchema = z.object({
  document: figmaNodeSchema,
})

const figmaImageResponseSchema = z.object({
  images: z.record(z.string(), z.string()),
})

type IconComponentData = {
  componentName: string
  name: string
  svg: string
}

const fetchFigmaFile = async (key: string) => {
  const response = await fetch(`https://api.figma.com/v1/files/${key}`, {
    headers: { 'X-Figma-Token': FIGMA_TOKEN },
  })

  return figmaFileResponseSchema.parse(await response.json())
}

const getComponentsFromNode = (node: FigmaNode): FigmaNode[] => {
  if (node.type === 'COMPONENT') {
    return [node]
  }

  if ('children' in node) {
    return node.children.map(getComponentsFromNode).flat()
  }

  return []
}

const getSVGsForNodes = async (key: string, components: FigmaNode[]) => {
  const componentIds = components.map(({ id }) => id)

  const response = await fetch(
    `https://api.figma.com/v1/images/${key}?ids=${componentIds.join()}&format=svg`,
    {
      headers: { 'X-Figma-Token': FIGMA_TOKEN },
    },
  )

  const { images } = figmaImageResponseSchema.parse(await response.json())

  return await Promise.all(
    components.map(async (component): Promise<IconComponentData> => {
      const svgResponse = await fetch(images[component.id])
      const svg = await svgResponse.text()

      return {
        svg,
        componentName: toPascalCase(component.name),
        name: toPascalCase(component.name).replace(/Icon$/, '').toLowerCase(),
      }
    }),
  )
}

/**
 * https://stackoverflow.com/a/4068586/7044732
 */
const toPascalCase = (str: string) => {
  return str
    .toLowerCase()
    .replace(new RegExp(/[-_]+/, 'g'), ' ')
    .replace(new RegExp(/[^\w\s]/, 'g'), '')
    .replace(
      new RegExp(/\s+(.)(\w*)/, 'g'),
      (_, group2: string, group3: string) => `${group2.toUpperCase() + group3}`,
    )
    .replace(new RegExp(/\w/), (s) => s.toUpperCase())
}

const { document: figmaDocument } = await fetchFigmaFile(FIGMA_FILE_ID)
const iconComponents = getComponentsFromNode(figmaDocument)
const icons = (await getSVGsForNodes(FIGMA_FILE_ID, iconComponents)).sort(
  (a, b) => (a.name > b.name ? 1 : -1),
)

await rm(ICONS_DIR, { recursive: true, force: true })
await mkdir(ICONS_DIR, { recursive: true })

await Promise.all(
  icons.map(async ({ componentName: name, svg }) => {
    const fileName = `${name}.tsx`
    const path = join(ICONS_DIR, fileName)

    const contents = await transform(
      svg,
      {
        icon: true,
        typescript: true,
        plugins: ['@svgr/plugin-jsx', '@svgr/plugin-prettier'],
        replaceAttrValues: {
          white: `var(${SVG_COLOR_VAR})`,
        },
      },
      { componentName: name },
    )

    await writeFile(path, contents)
  }),
)

const imports = icons
  .map(
    ({ componentName }) => `import ${componentName} from './${componentName}'`,
  )
  .join('\n')
const iconsMap = `export const icons = {
  ${icons
    .map(({ componentName, name }) => `${name}: ${componentName}`)
    .join(',\n  ')},
} as const`

const indexFilePath = join(ICONS_DIR, 'index.ts')
await writeFile(indexFilePath, `${imports}\n\n${iconsMap}`)

console.log('Icons generated successfully!')
