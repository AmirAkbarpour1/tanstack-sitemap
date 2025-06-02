import { describe, expect, it } from 'vitest'
import { buildDynamicUrl, isDynamic } from '~/utils/urlTemplate'

describe('isDynamic', () => {
  it('returns true if route contains $', () => {
    expect(isDynamic('/posts/$id')).toBe(true)
    expect(isDynamic('$slug')).toBe(true)
  })

  it('returns false if route does not contain $', () => {
    expect(isDynamic('/about')).toBe(false)
    expect(isDynamic('home')).toBe(false)
  })
})

describe('buildDynamicUrl', () => {
  it('replaces parameters with encoded values', () => {
    const template = '/posts/$id/comments/$commentId'
    const params = { id: '123', commentId: '456' }
    expect(buildDynamicUrl(template, params)).toBe('/posts/123/comments/456')
  })

  it('encodes parameter values', () => {
    const template = '/search/$query'
    const params = { query: 'hello world' }
    expect(buildDynamicUrl(template, params)).toBe('/search/hello%20world')
  })

  it('leaves parameters unchanged if not provided in params', () => {
    const template = '/user/$userId/profile/$section'
    const params = { userId: '42' }
    expect(buildDynamicUrl(template, params)).toBe('/user/42/profile/$section')
  })
})
