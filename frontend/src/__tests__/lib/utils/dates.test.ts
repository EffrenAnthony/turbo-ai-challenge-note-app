import { formatSmartDate } from '@/lib/utils/dates'

describe('formatSmartDate', () => {
  it('returns "today" for today\'s date', () => {
    const now = new Date()
    expect(formatSmartDate(now.toISOString())).toBe('today')
  })

  it('returns "yesterday" for yesterday\'s date', () => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    expect(formatSmartDate(yesterday.toISOString())).toBe('yesterday')
  })

  it('returns "Month Day" for older dates', () => {
    const result = formatSmartDate('2025-06-15T10:00:00Z')
    expect(result).toBe('June 15')
  })

  it('returns correct format for another old date', () => {
    const result = formatSmartDate('2025-03-15T12:00:00Z')
    expect(result).toBe('March 15')
  })
})
