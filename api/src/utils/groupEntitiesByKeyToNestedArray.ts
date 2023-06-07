import groupBy from 'lodash/groupBy'

/**
 * To be used when returning data for loaders.
 */
export const groupEntitiesByKeyToNestedArray = <
  T extends Record<string, unknown>,
  Field extends keyof T,
>({
  entities,
  ids,
  fieldToGroupBy,
}: {
  entities: T[]
  ids: number[]
  fieldToGroupBy: Field
}) => {
  const groupedById = groupBy(entities, fieldToGroupBy)

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return ids.map((id) => groupedById[id] ?? [])
}
