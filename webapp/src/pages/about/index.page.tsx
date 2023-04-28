import { useQuery } from '@apollo/client'
import React from 'react'

import { graphql } from '@/generated/gql'
import './code.css'

export function Page() {
  const { data } = useQuery(
    graphql(`
      query aboutPage {
        me {
          __typename
          ... on User {
            id
            email
          }
        }
      }
    `),
  )

  return (
    <>
      <h1>About</h1>
      <p>
        Example of using <code>vite-plugin-ssr</code>.
      </p>
      <p>{JSON.stringify(data?.me)}</p>
    </>
  )
}
