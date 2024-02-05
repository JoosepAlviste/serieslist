import type { NotWorthIt } from '@serieslist/util-types'

import { formatDate } from './date'

/**
 * A utility like `exposeString` and others from Pothos, but for `Date` fields.
 */
export const exposeDate =
  <
    Field extends string,
    T extends {
      [key in Field]: Date | null
    },
  >(
    fieldName: Field,
  ) =>
  (parent: T): T[Field] extends Date ? string : string | null => {
    const val = parent[fieldName]
    if (val === null) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return null as NotWorthIt
    }

    return formatDate(val)
  }
