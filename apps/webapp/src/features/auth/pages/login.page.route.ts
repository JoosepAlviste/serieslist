import { redirect } from 'vite-plugin-ssr/abort'
import { type PageContext } from 'vite-plugin-ssr/types'

export const guard = (pageContext: PageContext) => {
  if (pageContext.currentUser) {
    throw redirect('/')
  }
}
