import React from 'react'

type ErrorPageProps = {
  is404: boolean
  errorInfo?: string
}

export const Page = ({ is404, errorInfo }: ErrorPageProps) => {
  if (is404) {
    return (
      <>
        <h1>404 Page Not Found</h1>
        <p>This page could not be found.</p>
        {errorInfo && <p>{errorInfo}</p>}
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
