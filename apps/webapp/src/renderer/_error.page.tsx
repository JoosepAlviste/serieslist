import React from 'react'

import { usePageContext } from '#/hooks'

export const Page = () => {
  const { abortReason = 'This page could not be found.', is404 } =
    usePageContext()

  if (is404) {
    return (
      <>
        <h1>404 Page Not Found</h1>
        <p>{abortReason}</p>
      </>
    )
  } else {
    return (
      <>
        <h1>500 Internal Server Error</h1>
        <p>Something went wrong.</p>
      </>
    )
  }
}
