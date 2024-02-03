import { format, parseISO } from 'date-fns'

/**
 * @param date A date string in the format 'YYYY-MM-DD'
 */
export const parseDate = (date: string) => parseISO(date + 'T00:00:00.000Z')

/**
 * @returns A date string in the format 'YYYY-MM-DD'
 */
export const formatDate = (date: Date) => format(date, 'yyyy-MM-dd')
