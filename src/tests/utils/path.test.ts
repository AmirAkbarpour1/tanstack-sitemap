import { describe, expect, it } from 'vitest'
import { buildUrl, normalizePath } from '~/utils/path'

describe('buildUrl', () => {
  it('should return path as is if it starts with http', () => {
    const url = 'http://example.com/page'
    expect(buildUrl(url, 'https://baseurl.com')).toBe(url)
  })

  it('should concatenate baseUrl and path with single slash', () => {
    expect(buildUrl('/page', 'https://baseurl.com/')).toBe(
      'https://baseurl.com/page',
    )
    expect(buildUrl('page', 'https://baseurl.com/')).toBe(
      'https://baseurl.com/page',
    )
    expect(buildUrl('page', 'https://baseurl.com')).toBe(
      'https://baseurl.com/page',
    )
  })

  it('should handle baseUrl without trailing slash and path with leading slash', () => {
    expect(buildUrl('/page', 'https://baseurl.com')).toBe(
      'https://baseurl.com/page',
    )
  })
})

describe('normalizePath', () => {
  it('should return path as is if path is empty or "/"', () => {
    expect(normalizePath('')).toBe('')
    expect(normalizePath('/')).toBe('/')
    expect(normalizePath(undefined as any)).toBe(undefined)
  })

  it('should replace multiple slashes with single slash', () => {
    expect(normalizePath('//foo///bar//')).toBe('/foo/bar')
    expect(normalizePath('///')).toBe('/')
  })

  it('should remove trailing slashes', () => {
    expect(normalizePath('/foo/bar/')).toBe('/foo/bar')
  })
})
