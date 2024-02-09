import { format, parseISO } from 'date-fns'

/**
 * @param date A date string in the format 'YYYY-MM-DD'
 */
export const parseDate = (date: string) => parseISO(date + 'T00:00:00.000Z')

/**
 * @returns A date string in the format 'YYYY-MM-DD'
 */
export const stringifyDate = (date: Date) => format(date, 'yyyy-MM-dd')

/**
 * @param date In the format of 'yyyy-MM-dd'
 * @returns Formatted human-readable date
 */
export const formatDate = (date: string | Date) => {
  const parsedDate = typeof date === 'string' ? new Date(date) : date
  return format(parsedDate, 'd MMM yyyy')
}
