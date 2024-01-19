import { useMutation } from '@apollo/client'
import { Button, Error, Field } from '@serieslist/ui'
import React from 'react'
import { navigate } from 'vike/client/router'
import { z } from 'zod'

import { graphql } from '#/generated/gql'
import { useForm } from '#/lib/forms'

import * as s from './RegisterForm.css'

type FormData = {
  name: string
  email: string
  password: string
}

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(7),
})

export const RegisterForm = () => {
  const [mutate] = useMutation(
    graphql(`
      mutation register($input: RegisterInput!) {
        register(input: $input) {
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
              data?.register.__typename === 'User' ? data.register : undefined,
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

    const { register } = res.data ?? {}
    if (checkErrors(register)) {
      await navigate('/')
    }
  })

  return (
    <form onSubmit={onSubmit} className={s.form}>
      {errors.root && <Error>{errors.root.message}</Error>}

      <Field label="Email" error={errors.email} {...register('email')} />

      <Field label="Name" error={errors.name} {...register('name')} />

      <Field
        label="Password"
        type="password"
        error={errors.password}
        {...register('password')}
      />

      <Button variant="primary" type="submit" className={s.button} size="l">
        Register
      </Button>
    </form>
  )
}
