import { zodResolver } from '@hookform/resolvers/zod'
import type { NotWorthIt, LiterallyAnything } from '@serieslist/type-utils'
import {
  type FieldValues,
  useForm as useFormBase,
  type UseFormProps,
} from 'react-hook-form'
import type { ZodSchema } from 'zod'

import type { InvalidInputError } from '#/generated/gql/graphql'

/**
 * A wrapper around `react-hook-form` `useForm` that sets up some useful error
 * handling utilities.
 */
export const useForm = <
  TFieldValues extends FieldValues = FieldValues,
  TContext = LiterallyAnything,
>({
  schema,
  ...props
}: UseFormProps<TFieldValues, TContext> & {
  schema?: ZodSchema<TFieldValues>
} = {}) => {
  const res = useFormBase<TFieldValues, TContext>({
    mode: 'onTouched',
    resolver: schema ? zodResolver(schema) : undefined,
    ...props,
  })

  type SubmitHandlerArgument = {
    data: TFieldValues
    event?: React.BaseSyntheticEvent
    checkErrors: typeof checkErrors
  }

  /**
   * Check if the response has any validation errors. If yes, save them to the
   * form state, otherwise do nothing.
   *
   * @returns true if no validation errors, false if there were any
   */
  const checkErrors = <T extends { __typename: string | 'InvalidInputError' }>(
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
