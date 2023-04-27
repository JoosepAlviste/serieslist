import { useMutation } from '@apollo/client'
import React from 'react'

import { graphql } from '@/generated/gql'
import { useForm } from '@/lib/forms'

type FormData = {
  email: string
  password: string
}

export const Page = () => {
  const [mutate] = useMutation(
    graphql(`
      mutation login($input: LoginInput!) {
        login(input: $input) {
          __typename
          ... on User {
            id
            email
          }
          ... on InvalidInputError {
            fieldErrors {
              path
              message
            }
            message
          }
        }
      }
    `),
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()

  const onSubmit = handleSubmit(async ({ data, checkErrors }) => {
    const res = await mutate({
      variables: {
        input: data,
      },
    })

    const { login } = res.data ?? {}
    if (checkErrors(login)) {
      // TODO: Login was successful, redirect
    }
  })

  return (
    <>
      <h1>Login</h1>
      <form onSubmit={onSubmit}>
        {errors.root && <p>Root error: {errors.root.message}</p>}

        <label>
          Email
          <input {...register('email')} />
        </label>
        {errors.email && <p>Error: {errors.email.message}</p>}
        <label>
          Password
          <input type="password" {...register('password')} />
        </label>
        {errors.password && <p>Error: {errors.password.message}</p>}

        <button type="submit">Log in</button>
      </form>
    </>
  )
}
