import { describe, expect, it } from 'vitest'
import { create } from 'xmlbuilder2'
import type {
  AlternateLink,
  SitemapImage,
  SitemapNews,
  SitemapVideo,
} from '~/core/types'
import { createUrlElement } from '~/utils/createUrlElement'

describe('createUrlElement', () => {
  it('creates basic <url> element with required url only', () => {
    const doc = create().ele('urlset')
    const entry = { url: 'https://example.com' }

    createUrlElement(doc, entry)
    const xml = doc.end({ prettyPrint: true })

    expect(xml).toContain('<url>')
    expect(xml).toContain('<loc>https://example.com</loc>')
  })

  it('includes lastModified, changeFrequency and priority', () => {
    const doc = create().ele('urlset')
    const entry = {
      url: 'https://example.com/page',
      lastModified: '2024-01-01T12:00:00Z',
      changeFrequency: 'weekly',
      priority: '0.8',
    }

    createUrlElement(doc, entry)
    const xml = doc.end()

    expect(xml).toContain('<lastmod>2024-01-01T12:00:00Z</lastmod>')
    expect(xml).toContain('<changefreq>weekly</changefreq>')
    expect(xml).toContain('<priority>0.8</priority>')
  })

  it('renders alternate links', () => {
    const doc = create().ele('urlset')
    const alternates: Array<AlternateLink> = [
      { hrefLang: 'en', href: 'https://example.com/en' },
      { hrefLang: 'de', href: 'https://example.com/de' },
    ]
    const entry = {
      url: 'https://example.com',
      alternates,
    }

    createUrlElement(doc, entry)
    const xml = doc.end()

    alternates.forEach((alt) => {
      expect(xml).toContain(
        `<xhtml:link rel="alternate" hreflang="${alt.hrefLang}" href="${alt.href}"/>`,
      )
    })
  })

  it('renders images correctly', () => {
    const doc = create().ele('urlset')
    const images: Array<SitemapImage> = [
      {
        loc: 'https://example.com/image.jpg',
        caption: 'Caption',
        geoLocation: 'Tehran',
        title: 'Image Title',
        license: 'https://example.com/license',
      },
    ]
    const entry = {
      url: 'https://example.com',
      images,
    }

    createUrlElement(doc, entry)
    const xml = doc.end()

    images.forEach((img) => {
      expect(xml).toContain('<image:image>')
      expect(xml).toContain(`<image:loc>${img.loc}</image:loc>`)
      expect(xml).toContain(`<image:caption>${img.caption}</image:caption>`)
      expect(xml).toContain(
        `<image:geo_location>${img.geoLocation}</image:geo_location>`,
      )
      expect(xml).toContain(`<image:title>${img.title}</image:title>`)
      expect(xml).toContain(`<image:license>${img.license}</image:license>`)
    })
  })

  it('renders videos with all optional properties', () => {
    const doc = create().ele('urlset')
    const videos: Array<SitemapVideo> = [
      {
        thumbnailLoc: 'https://example.com/thumb.jpg',
        title: 'Video Title',
        description: 'Video description',
        contentLoc: 'https://example.com/content.mp4',
        playerLoc: 'https://example.com/player',
        duration: 120,
        expirationDate: new Date('2024-12-31T00:00:00Z'),
        rating: 4.5,
        viewCount: 1000,
        publicationDate: new Date('2024-01-01T00:00:00Z'),
        familyFriendly: true,
        restriction: { relationship: 'allow', countries: 'US CA' },
        galleryLoc: 'https://example.com/gallery',
        price: {
          currency: 'USD',
          amount: 9.99,
          type: 'rent',
          resolution: 'HD',
        },
        requiresSubscription: false,
        uploader: { name: 'UploaderName', info: 'https://uploader.info' },
        platform: { relationship: 'allow', platforms: 'WEB' },
        live: false,
        tags: ['tag1', 'tag2'],
      },
    ]
    const entry = {
      url: 'https://example.com',
      videos,
    }

    createUrlElement(doc, entry)
    const xml = doc.end()

    const vid = videos[0]
    expect(xml).toContain('<video:video>')
    expect(xml).toContain(
      `<video:thumbnail_loc>${vid.thumbnailLoc}</video:thumbnail_loc>`,
    )
    expect(xml).toContain(`<video:title>${vid.title}</video:title>`)
    expect(xml).toContain(
      `<video:description>${vid.description}</video:description>`,
    )
    expect(xml).toContain(
      `<video:content_loc>${vid.contentLoc}</video:content_loc>`,
    )
    expect(xml).toContain(
      `<video:player_loc>${vid.playerLoc}</video:player_loc>`,
    )
    expect(xml).toContain(`<video:duration>${vid.duration}</video:duration>`)
    expect(xml).toContain(
      `<video:expiration_date>2024-12-31T00:00:00.000Z</video:expiration_date>`,
    )
    expect(xml).toContain(`<video:rating>${vid.rating}</video:rating>`)
    expect(xml).toContain(
      `<video:view_count>${vid.viewCount}</video:view_count>`,
    )
    expect(xml).toContain(
      `<video:publication_date>2024-01-01T00:00:00.000Z</video:publication_date>`,
    )
    expect(xml).toContain(`<video:family_friendly>yes</video:family_friendly>`)
    expect(xml).toContain(
      `<video:restriction relationship="allow">US CA</video:restriction>`,
    )
    expect(xml).toContain(
      `<video:gallery_loc>${vid.galleryLoc}</video:gallery_loc>`,
    )
    expect(xml).toContain(
      `<video:price currency="USD" type="rent" resolution="HD">${vid.price!.amount}</video:price>`,
    )
    expect(xml).toContain(
      `<video:requires_subscription>no</video:requires_subscription>`,
    )
    expect(xml).toContain(
      `<video:uploader info="https://uploader.info">${vid.uploader!.name}</video:uploader>`,
    )
    expect(xml).toContain(
      `<video:platform relationship="allow">WEB</video:platform>`,
    )
    expect(xml).toContain(`<video:live>no</video:live>`)
    vid.tags?.forEach((tag) => {
      expect(xml).toContain(`<video:tag>${tag}</video:tag>`)
    })
  })

  it('renders news entries correctly', () => {
    const doc = create().ele('urlset')
    const news: Array<SitemapNews> = [
      {
        publicationName: 'Daily News',
        publicationLanguage: 'en',
        publicationDate: new Date('2024-05-01T00:00:00Z'),
        title: 'News Title',
        keywords: 'keyword1, keyword2',
        genres: 'genre1, genre2',
        stockTickers: 'NASDAQ:ABC',
      },
    ]
    const entry = {
      url: 'https://example.com',
      news,
    }

    createUrlElement(doc, entry)
    const xml = doc.end()

    const n = news[0]
    expect(xml).toContain('<news:news>')
    expect(xml).toContain('<news:publication>')
    expect(xml).toContain(`<news:name>${n.publicationName}</news:name>`)
    expect(xml).toContain(
      `<news:language>${n.publicationLanguage}</news:language>`,
    )
    expect(xml).toContain(
      `<news:publication_date>2024-05-01T00:00:00.000Z</news:publication_date>`,
    )
    expect(xml).toContain(`<news:title>${n.title}</news:title>`)
    expect(xml).toContain(`<news:keywords>${n.keywords}</news:keywords>`)
    expect(xml).toContain(`<news:genres>${n.genres}</news:genres>`)
    expect(xml).toContain(
      `<news:stock_tickers>${n.stockTickers}</news:stock_tickers>`,
    )
  })
})
