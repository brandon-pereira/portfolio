/**
 * Function to format a date into format Weekday, Month Day, Year
 * @param {Date} date Date to format
 * @return {String} Formatted string
 */
export default function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}
