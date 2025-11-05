import { useMutation } from '@apollo/client'
import { Button, Error, Field } from '@serieslist/core-ui'
import React from 'react'
import { navigate } from 'vike/client/router'
import { z } from 'zod/v4'

import { graphql } from '#/generated/gql'
import { useForm } from '#/lib/forms'

import * as s from './LoginForm.css'

const schema = z.object({
  email: z.email(),
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
            me: () => (data?.login.__typename === 'User' ? data.login : null),
          },
        })
      },
    },
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ schema })

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
    <form onSubmit={onSubmit} className={s.form}>
      {errors.root && <Error>{errors.root.message}</Error>}

      <Field
        label="Email"
        type="email"
        error={errors.email}
        {...register('email')}
      />

      <Field
        label="Password"
        type="password"
        error={errors.password}
        {...register('password')}
      />

      <Button variant="primary" type="submit" className={s.button} size="l">
        Log in
      </Button>
    </form>
  )
}
