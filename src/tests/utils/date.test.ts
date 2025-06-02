import { describe, expect, it } from 'vitest'
import { formatDate } from '~/utils/date'

describe('formatDate', () => {
  it('should return current date in ISO string if no argument passed', () => {
    const result = formatDate()
    const now = new Date().toISOString().slice(0, 10)
    expect(result.slice(0, 10)).toBe(now)
  })

  it('should format Date instance to ISO string', () => {
    const date = new Date('2023-01-01T12:34:56Z')
    const result = formatDate(date)
    expect(result).toBe(date.toISOString())
  })

  it('should return string argument as is', () => {
    const dateStr = '2025-06-02T10:20:30Z'
    const result = formatDate(dateStr)
    expect(result).toBe(dateStr)
  })
})
