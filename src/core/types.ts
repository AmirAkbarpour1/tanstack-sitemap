export type ExtractParams<T extends string> = string extends T
  ? Record<string, string>
  : T extends `${infer _Start}$${infer Param}/${infer Rest}`
    ? { [K in Param]: string } & ExtractParams<`/${Rest}`>
    : T extends `${infer _Start}$${infer Param}`
      ? { [K in Param]: string }
      : {}

export interface AlternateLink {
  hrefLang: string
  href: string
}

export interface SitemapImage {
  loc: string
  caption?: string
  geoLocation?: string
  title?: string
  license?: string
}

export interface SitemapVideo {
  thumbnailLoc: string
  title: string
  description: string
  contentLoc?: string
  playerLoc?: string
  duration?: number
  expirationDate?: Date | string
  rating?: number
  viewCount?: number
  publicationDate?: Date | string
  familyFriendly?: boolean
  restriction?: { relationship: 'allow' | 'deny'; countries: string }
  galleryLoc?: string
  price?: {
    amount: number
    currency: string
    type?: string
    resolution?: string
  }
  requiresSubscription?: boolean
  uploader?: { name: string; info?: string }
  platform?: { relationship: 'allow' | 'deny'; platforms: string }
  live?: boolean
  tags?: Array<string>
}

export interface SitemapNews {
  publicationName: string
  publicationLanguage: string
  title: string
  publicationDate: Date | string
  keywords?: string
  genres?: string
  stockTickers?: string
}

export type ChangeFrequency =
  | 'always'
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | 'never'

export interface BaseSitemapEntry {
  changeFrequency?: ChangeFrequency
  priority?: number
  lastModified?: Date | string
  alternatives?: Array<AlternateLink>
  images?: Array<SitemapImage>
  videos?: Array<SitemapVideo>
  news?: Array<SitemapNews>
}

export interface DynamicRouteConfig<T extends Record<string, string>>
  extends BaseSitemapEntry {
  provideParams: () => Array<T> | Promise<Array<T>>
  dynamicAlternatives?: ({
    params,
    path,
  }: {
    params: T
    path: string
  }) => Array<AlternateLink> | Promise<Array<AlternateLink>>
  dynamicImages?: ({
    params,
    path,
  }: {
    params: T
    path: string
  }) => Array<SitemapImage> | Promise<Array<SitemapImage>>
  dynamicVideos?: ({
    params,
    path,
  }: {
    params: T
    path: string
  }) => Array<SitemapVideo> | Promise<Array<SitemapVideo>>
  dynamicNews?: ({
    params,
    path,
  }: {
    params: T
    path: string
  }) => Array<SitemapNews> | Promise<Array<SitemapNews>>
}

export interface SitemapConfig<TRoutes extends string> {
  defaults: {
    baseUrl: string
    changeFrequency?: ChangeFrequency
    priority?: number
    lastModified?: Date | string
  }
  routes?: {
    [K in TRoutes]?: ExtractParams<K> extends Record<string, never>
      ? BaseSitemapEntry
      : DynamicRouteConfig<ExtractParams<K>>
  }
}
