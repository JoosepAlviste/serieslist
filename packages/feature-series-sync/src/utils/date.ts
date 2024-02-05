import { format } from 'date-fns'

/**
 * @returns A date string in the format 'YYYY-MM-DD'
 */
export const formatDate = (date: Date) => format(date, 'yyyy-MM-dd')
