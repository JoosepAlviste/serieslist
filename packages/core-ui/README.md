# @serieslist/core-ui

## Adding new icons from Figma

Icons added to Figma can be used to automatically generate React components.

First, generate a personal access token with "Read-only" access for "File
content". Then, run this command in the `packages/ui` folder:

```sh
FIGMA_TOKEN=<your_token> pnpm sync-icons
```
