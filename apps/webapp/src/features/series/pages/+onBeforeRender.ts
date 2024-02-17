import type { OnBeforeRenderSync } from 'vike/types'

export const onBeforeRender: OnBeforeRenderSync = () => {
  return {
    pageContext: {
      documentProps: {
        title: 'My series list',
      },
    },
  }
}
