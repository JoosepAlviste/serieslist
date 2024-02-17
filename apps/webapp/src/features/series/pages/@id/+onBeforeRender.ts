import { render } from 'vike/abort'
import type { OnBeforeRenderAsync } from 'vike/types'

import { SeriesDetailsPageDocument } from '#/generated/gql/graphql'

export const onBeforeRender: OnBeforeRenderAsync = async (pageContext) => {
  const { apollo, routeParams } = pageContext
  const id = routeParams?.id
  if (!id) {
    throw render(404)
  }

  const { data } = await apollo.query({
    query: SeriesDetailsPageDocument,
    variables: { id },
  })
  if (data.series.__typename !== 'Series') {
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
