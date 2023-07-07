import { format } from 'date-fns'

/**
 * @param date In the format of yyyy-MM-dd
 */
export const formatDate = (date: string | Date) => {
  const parsedDate = typeof date === 'string' ? new Date(date) : date
  return format(parsedDate, 'd MMM yyyy')
}
