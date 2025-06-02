import { describe, expect, it } from 'vitest'
import { processMedia } from '~/utils/media'

describe('processMedia', () => {
  const baseUrl = 'https://example.com'

  it('should process empty array', () => {
    expect(processMedia([], baseUrl)).toEqual([])
  })

  it('should build full URLs for known properties', () => {
    const items = [
      {
        loc: '/image.png',
        href: 'http://external.com/file',
        thumbnailLoc: '/thumb.jpg',
        contentLoc: '/content.mp4',
        playerLoc: '/player.html',
        galleryLoc: '/gallery/',
        license: '/license.txt',
      },
    ]

    const result = processMedia(items, baseUrl)

    expect(result[0].loc).toBe('https://example.com/image.png')
    expect(result[0].href).toBe('http://external.com/file')
    expect(result[0].thumbnailLoc).toBe('https://example.com/thumb.jpg')
    expect(result[0].contentLoc).toBe('https://example.com/content.mp4')
    expect(result[0].playerLoc).toBe('https://example.com/player.html')
    expect(result[0].galleryLoc).toBe('https://example.com/gallery/')
    expect(result[0].license).toBe('https://example.com/license.txt')
  })

  it('should not build URL for undefined properties', () => {
    const items = [{}]
    const result = processMedia(items, baseUrl)
    expect(result[0].loc).toBeUndefined()
    expect(result[0].href).toBeUndefined()
    expect(result[0].thumbnailLoc).toBeUndefined()
    expect(result[0].contentLoc).toBeUndefined()
    expect(result[0].playerLoc).toBeUndefined()
    expect(result[0].galleryLoc).toBeUndefined()
    expect(result[0].license).toBeUndefined()
  })
})
