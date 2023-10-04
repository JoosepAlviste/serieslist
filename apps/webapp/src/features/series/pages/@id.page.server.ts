import { RenderErrorPage } from 'vike/RenderErrorPage'
import { type PageContext } from 'vike/types'

import { SeriesDetailsPageDocument } from '#/generated/gql/graphql'

export const onBeforeRender = async (pageContext: PageContext) => {
  const { apollo, routeParams } = pageContext
  const id = routeParams?.id
  if (!id) {
    throw RenderErrorPage({
      pageContext: {},
    })
  }

  const { data } = await apollo.query({
    query: SeriesDetailsPageDocument,
    variables: { id },
  })
  if (data.series.__typename === 'NotFoundError') {
    throw RenderErrorPage({
      pageContext: {
        pageProps: {
          errorInfo: 'This series does not exist.',
        },
      },
    })
  }

  return {
    pageContext: {
      documentProps: {
        title: data.series.title,
      },
    },
  }
}
