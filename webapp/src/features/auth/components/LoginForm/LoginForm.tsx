import { useMutation } from '@apollo/client'
import React from 'react'
import { navigate } from 'vite-plugin-ssr/client/router'
import { z } from 'zod'

import { Field } from '@/components'
import { graphql } from '@/generated/gql'
import { useForm } from '@/lib/forms'

type FormData = {
  email: string
  password: string
}

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(7),
})

export const LoginForm = () => {
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
    {
      update(cache, { data }) {
        cache.modify({
          fields: {
            me: () =>
              data?.login.__typename === 'User' ? data.login : undefined,
          },
        })
      },
    },
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ schema })

  const onSubmit = handleSubmit(async ({ data, checkErrors, event }) => {
    event?.preventDefault()

    const res = await mutate({
      variables: {
        input: data,
      },
    })

    const { login } = res.data ?? {}
    if (checkErrors(login)) {
      await navigate('/')
    }
  })

  return (
    <form onSubmit={onSubmit}>
      {errors.root && <p>Root error: {errors.root.message}</p>}

      <Field label="Email" error={errors.email} {...register('email')} />

      <Field
        label="Password"
        type="password"
        error={errors.password}
        {...register('password')}
      />

      <button type="submit">Log in</button>
    </form>
  )
}
