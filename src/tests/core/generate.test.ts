import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { SitemapConfig } from '~/core/types'
import * as urlTemplate from '~/utils/urlTemplate'
import * as dateUtils from '~/utils/date'
import * as mediaUtils from '~/utils/media'
import * as pathUtils from '~/utils/path'
import { generateSitemap, processRoute } from '~/core/generate'

vi.mock('~/utils/urlTemplate')
vi.mock('~/utils/date')
vi.mock('~/utils/media')
vi.mock('~/utils/path')

const mockedUrlTemplate = vi.mocked(urlTemplate)
const mockedDateUtils = vi.mocked(dateUtils)
const mockedMediaUtils = vi.mocked(mediaUtils)
const mockedPathUtils = vi.mocked(pathUtils)

describe('processRoute', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    mockedUrlTemplate.isDynamic.mockImplementation((route) =>
      route.includes('$'),
    )
    mockedUrlTemplate.buildDynamicUrl.mockImplementation((template, params) =>
      template.replace(/\$(\w+)/g, (_, key) => params[key]),
    )
    mockedDateUtils.formatDate.mockImplementation((date) =>
      date ? new Date(date).toISOString() : new Date().toISOString(),
    )
    mockedMediaUtils.processMedia.mockImplementation((arr) => arr)
    mockedPathUtils.buildUrl.mockImplementation(
      (path, baseUrl) => baseUrl + path,
    )
  })

  it('should process static route', async () => {
    const entries = await processRoute(
      '/about',
      {
        lastModified: '2023-01-01',
        changeFrequency: 'daily',
        priority: 0.5,
        alternatives: [{ hrefLang: 'en', href: 'https://example.com/en' }],
      },
      {
        baseUrl: 'https://example.com',
        lastModified: '2022-01-01',
        changeFrequency: 'monthly',
        priority: 0.3,
      },
      'https://example.com',
    )
    expect(entries).toHaveLength(1)
    expect(entries[0]).toMatchObject({
      url: 'https://example.com/about',
      lastModified: new Date('2023-01-01').toISOString(),
      changeFrequency: 'daily',
      priority: 0.5,
      alternates: [{ hrefLang: 'en', href: 'https://example.com/en' }],
    })
  })

  it('should process dynamic route with params', async () => {
    const provideParams = vi.fn().mockResolvedValue([{ id: '123' }])
    const dynamicAlternatives = vi
      .fn()
      .mockResolvedValue([{ hrefLang: 'en', href: 'https://example.com/en' }])

    const entries = await processRoute(
      '/posts/$id',
      {
        provideParams,
        dynamicAlternatives,
        lastModified: '2023-01-01',
      },
      {
        baseUrl: 'https://example.com',
        lastModified: '2022-01-01',
      },
      'https://example.com',
    )

    expect(provideParams).toHaveBeenCalled()
    expect(dynamicAlternatives).toHaveBeenCalledWith({
      params: { id: '123' },
      path: '/posts/123',
    })
    expect(entries).toHaveLength(1)
    expect(entries[0].url).toBe('https://example.com/posts/123')
    expect(entries[0].lastModified).toBe(new Date('2023-01-01').toISOString())
  })
})

describe('generateSitemap', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    mockedUrlTemplate.isDynamic.mockImplementation((route) =>
      route.includes('$'),
    )
    mockedUrlTemplate.buildDynamicUrl.mockImplementation((template, params) =>
      template.replace(/\$(\w+)/g, (_, key) => params[key]),
    )
    mockedDateUtils.formatDate.mockImplementation((date) =>
      date ? new Date(date).toISOString() : new Date().toISOString(),
    )
    mockedMediaUtils.processMedia.mockImplementation((arr) => arr)
    mockedPathUtils.buildUrl.mockImplementation(
      (path, baseUrl) => baseUrl + path,
    )
  })

  it('should generate valid sitemap xml', async () => {
    const config: SitemapConfig<'/about' | '/posts/$id'> = {
      defaults: {
        baseUrl: 'https://example.com',
        changeFrequency: 'daily',
        priority: 0.5,
        lastModified: '2023-01-01',
      },
      routes: {
        '/about': {
          lastModified: '2023-01-01',
          changeFrequency: 'weekly',
          priority: 0.6,
        },
        '/posts/$id': {
          provideParams: () => Promise.resolve([{ id: '1' }, { id: '2' }]),
        },
      },
    }

    const xml = await generateSitemap(config)

    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>')
    expect(xml).toContain('<urlset')
    expect(xml).toContain('<loc>https://example.com/about</loc>')
    expect(xml).toContain('<loc>https://example.com/posts/1</loc>')
    expect(xml).toContain('<loc>https://example.com/posts/2</loc>')
  })
})
