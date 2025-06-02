import type {
  AlternateLink,
  SitemapImage,
  SitemapNews,
  SitemapVideo,
} from '~/core/types'
import { formatDate } from '~/utils/date'

export const createUrlElement = (doc: any, entry: any) => {
  const url = doc.ele('url')
  url.ele('loc').txt(entry.url)

  if (entry.lastModified) url.ele('lastmod').txt(entry.lastModified)
  if (entry.changeFrequency) url.ele('changefreq').txt(entry.changeFrequency)
  if (entry.priority !== undefined) url.ele('priority').txt(entry.priority)

  entry.alternates?.forEach((alt: AlternateLink) => {
    url
      .ele('xhtml:link')
      .att({ rel: 'alternate', hreflang: alt.hrefLang, href: alt.href })
  })

  entry.images?.forEach((img: SitemapImage) => {
    const image = url.ele('image:image')
    image.ele('image:loc').txt(img.loc)
    if (img.caption) image.ele('image:caption').txt(img.caption)
    if (img.geoLocation) image.ele('image:geo_location').txt(img.geoLocation)
    if (img.title) image.ele('image:title').txt(img.title)
    if (img.license) image.ele('image:license').txt(img.license)
  })

  entry.videos?.forEach((vid: SitemapVideo) => {
    const video = url.ele('video:video')
    video.ele('video:thumbnail_loc').txt(vid.thumbnailLoc)
    video.ele('video:title').txt(vid.title)
    video.ele('video:description').txt(vid.description)

    if (vid.contentLoc) video.ele('video:content_loc').txt(vid.contentLoc)
    if (vid.playerLoc) video.ele('video:player_loc').txt(vid.playerLoc)
    if (vid.duration !== undefined)
      video.ele('video:duration').txt(vid.duration)
    if (vid.expirationDate)
      video.ele('video:expiration_date').txt(formatDate(vid.expirationDate))
    if (vid.rating !== undefined) video.ele('video:rating').txt(vid.rating)
    if (vid.viewCount !== undefined)
      video.ele('video:view_count').txt(vid.viewCount)
    if (vid.publicationDate)
      video.ele('video:publication_date').txt(formatDate(vid.publicationDate))
    if (vid.familyFriendly !== undefined)
      video.ele('video:family_friendly').txt(vid.familyFriendly ? 'yes' : 'no')
    if (vid.restriction)
      video
        .ele('video:restriction')
        .att('relationship', vid.restriction.relationship)
        .txt(vid.restriction.countries)
    if (vid.galleryLoc) video.ele('video:gallery_loc').txt(vid.galleryLoc)
    if (vid.price) {
      const price = video
        .ele('video:price')
        .att('currency', vid.price.currency)
        .txt(vid.price.amount)
      if (vid.price.type) price.att('type', vid.price.type)
      if (vid.price.resolution) price.att('resolution', vid.price.resolution)
    }
    if (vid.requiresSubscription !== undefined)
      video
        .ele('video:requires_subscription')
        .txt(vid.requiresSubscription ? 'yes' : 'no')
    if (vid.uploader) {
      const uploader = video.ele('video:uploader').txt(vid.uploader.name)
      if (vid.uploader.info) uploader.att('info', vid.uploader.info)
    }
    if (vid.platform)
      video
        .ele('video:platform')
        .att('relationship', vid.platform.relationship)
        .txt(vid.platform.platforms)
    if (vid.live !== undefined)
      video.ele('video:live').txt(vid.live ? 'yes' : 'no')
    vid.tags?.forEach((tag) => video.ele('video:tag').txt(tag))
  })

  entry.news?.forEach((news: SitemapNews) => {
    const newsEl = url.ele('news:news')
    const pub = newsEl.ele('news:publication')
    pub.ele('news:name').txt(news.publicationName)
    pub.ele('news:language').txt(news.publicationLanguage)

    newsEl.ele('news:publication_date').txt(formatDate(news.publicationDate))
    newsEl.ele('news:title').txt(news.title)

    if (news.keywords) newsEl.ele('news:keywords').txt(news.keywords)
    if (news.genres) newsEl.ele('news:genres').txt(news.genres)
    if (news.stockTickers)
      newsEl.ele('news:stock_tickers').txt(news.stockTickers)
  })
}
