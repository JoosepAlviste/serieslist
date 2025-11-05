import { zodResolver } from '@hookform/resolvers/zod'
import type { NotWorthIt, LiterallyAnything } from '@serieslist/util-types'
import { useForm as useFormBase } from 'react-hook-form'
import type { FieldValues, UseFormProps } from 'react-hook-form'
import type { input, output, ZodType } from 'zod/v4'

import type { InvalidInputError } from '#/generated/gql/graphql'

/**
 * A wrapper around `react-hook-form` `useForm` that sets up some useful error
 * handling utilities.
 */
export const useForm = <TSchema extends ZodType<FieldValues, FieldValues>>({
  schema,
  ...props
}: UseFormProps<input<TSchema>, LiterallyAnything, output<TSchema>> & {
  schema: TSchema
}) => {
  const res = useFormBase<input<TSchema>, LiterallyAnything, output<TSchema>>({
    mode: 'onTouched',
    resolver: zodResolver(schema),
    ...props,
  })

  type SubmitHandlerArgument = {
    data: output<TSchema>
    event?: React.BaseSyntheticEvent
    checkErrors: typeof checkErrors
  }

  /**
   * Check if the response has any validation errors. If yes, save them to the
   * form state, otherwise do nothing.
   *
   * @returns true if no validation errors, false if there were any
   */
  const checkErrors = <T extends { __typename: string }>(
    response: T | undefined,
  ): response is Exclude<T, { __typename: 'InvalidInputError' }> => {
    if (response === undefined || response.__typename !== 'InvalidInputError') {
      return true
    }

    ;(response as NotWorthIt as InvalidInputError).fieldErrors.forEach(
      (error) => {
        res.setError(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          error.path
            .filter((pathItem) => pathItem !== 'input')
            .join('.') as NotWorthIt,
          {
            type: 'manual',
            message: error.message,
          },
        )
      },
    )

    return false
  }

  const handleSubmit = (
    onSubmit: (arg: SubmitHandlerArgument) => Promise<unknown>,
  ) => {
    return res.handleSubmit((data, event) => {
      return onSubmit({
        data,
        event,
        checkErrors,
      })
    })
  }

  return {
    ...res,
    handleSubmit,
  }
}
