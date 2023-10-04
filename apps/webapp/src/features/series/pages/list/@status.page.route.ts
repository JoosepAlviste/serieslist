import { redirect } from 'vike/abort'
import { type PageContext } from 'vike/types'

export const guard = (pageContext: PageContext) => {
  if (!pageContext.currentUser) {
    throw redirect('/')
  }
}
