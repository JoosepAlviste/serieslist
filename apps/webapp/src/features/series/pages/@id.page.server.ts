import { render } from 'vite-plugin-ssr/abort'
import { type PageContext } from 'vite-plugin-ssr/types'

import { SeriesDetailsPageDocument } from '#/generated/gql/graphql'

export const onBeforeRender = async (pageContext: PageContext) => {
  const { apollo, routeParams } = pageContext
  const id = routeParams?.id
  if (!id) {
    throw render(404)
  }

  const { data } = await apollo.query({
    query: SeriesDetailsPageDocument,
    variables: { id },
  })
  if (data.series.__typename === 'NotFoundError') {
    throw render(404, 'This series does not exist.')
  }

  return {
    pageContext: {
      documentProps: {
        title: data.series.title,
      },
    },
  }
}
