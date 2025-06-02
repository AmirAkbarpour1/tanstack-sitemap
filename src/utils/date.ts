export const formatDate = (date?: Date | string): string =>
  !date
    ? new Date().toISOString()
    : date instanceof Date
      ? date.toISOString()
      : date
