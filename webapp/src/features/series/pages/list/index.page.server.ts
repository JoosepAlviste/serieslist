import { type PageContext } from '@/renderer/types'

export const onBeforeRender = (
  pageContext: PageContext,
): { pageContext?: Partial<PageContext> } | undefined => {
  if (!pageContext.currentUser) {
    return {
      pageContext: {
        redirectTo: '/',
      },
    }
  }
}
