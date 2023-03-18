import { gql, useQuery } from '@apollo/client'
import React from 'react'

import { Counter } from './Counter'

export function Page() {
  const { data } = useQuery<{ hello: string }>(gql`
    {
      hello
    }
  `)

  return (
    <>
      <h1>Welcome</h1>
      This page is:
      <ul>
        <li>Rendered to HTML.</li>
        <li>
          Interactive. <Counter />
        </li>
        <li>{JSON.stringify(data)}</li>
      </ul>
    </>
  )
}
