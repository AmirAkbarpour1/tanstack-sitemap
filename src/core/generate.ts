import { create } from 'xmlbuilder2'
import type {
  BaseSitemapEntry,
  DynamicRouteConfig,
  SitemapConfig,
} from '~/core/types'
import { buildUrl, normalizePath  } from '~/utils/path'
import { buildDynamicUrl, isDynamic } from '~/utils/urlTemplate'
import { createUrlElement } from '~/utils/createUrlElement'
import { formatDate } from '~/utils/date'
import { processMedia } from '~/utils/media'

export const processRoute = async <TRoutes extends string>(
  route: TRoutes,
  config:
    | BaseSitemapEntry
    | DynamicRouteConfig<Record<string, string>>
    | undefined,
  defaults: SitemapConfig<TRoutes>['defaults'],
  baseUrl: string,
): Promise<Array<any>> => {
  const entries: Array<any> = []

  if (isDynamic(route)) {
    if (!config || !('provideParams' in config)) return entries

    const paramSets = await config.provideParams()

    for (const params of paramSets) {
      const resolvedPath = buildDynamicUrl(route, params)
      const absoluteUrl = `${baseUrl}${resolvedPath}`

      const alternates = config.dynamicAlternatives
        ? processMedia(
            await config.dynamicAlternatives({ path: resolvedPath, params }),
            baseUrl,
          )
        : processMedia(config.alternatives || [], baseUrl)

      const images = config.dynamicImages
        ? processMedia(
            await config.dynamicImages({ path: resolvedPath, params }),
            baseUrl,
          )
        : processMedia(config.images || [], baseUrl)

      const videos = config.dynamicVideos
        ? processMedia(
            await config.dynamicVideos({ path: resolvedPath, params }),
            baseUrl,
          )
        : processMedia(config.videos || [], baseUrl)

      const news = config.dynamicNews
        ? await config.dynamicNews({ path: resolvedPath, params })
        : config.news || []

      entries.push({
        url: absoluteUrl,
        lastModified: formatDate(config.lastModified || defaults.lastModified),
        changeFrequency: config.changeFrequency || defaults.changeFrequency,
        priority: config.priority ?? defaults.priority,
        alternates,
        images,
        videos,
        news,
      })
    }
  } else {
    const absoluteUrl = buildUrl(normalizePath(route), baseUrl)

    entries.push({
      url: absoluteUrl,
      lastModified: formatDate(config?.lastModified || defaults.lastModified),
      changeFrequency: config?.changeFrequency || defaults.changeFrequency,
      priority: config?.priority ?? defaults.priority,
      alternates: processMedia(config?.alternatives || [], baseUrl),
      images: processMedia(config?.images || [], baseUrl),
      videos: processMedia(config?.videos || [], baseUrl),
      news: config?.news || [],
    })
  }

  return entries
}

export const generateSitemap = async <TRoutes extends string>(
  config: SitemapConfig<TRoutes>,
): Promise<string> => {
  const { defaults, routes = {} } = config
  const baseUrl = defaults.baseUrl.replace(/\/$/, '')
  const allEntries: Array<any> = []

  // Process configured routes
  for (const [routePath, routeConfig] of Object.entries(routes) as Array<
    [TRoutes, BaseSitemapEntry | DynamicRouteConfig<Record<string, string>>]
  >) {
    const route = routePath
    const entries = await processRoute(route, routeConfig, defaults, baseUrl)
    allEntries.push(...entries)
  }

  // Remove duplicates
  const seen = new Set<string>()
  const uniqueEntries = allEntries.filter((entry) => {
    if (seen.has(entry.url)) return false
    seen.add(entry.url)
    return true
  })

  // Generate XML
  const doc = create({ version: '1.0', encoding: 'UTF-8' })
  const urlset = doc
    .ele('urlset')
    .att('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9')
    .att('xmlns:xhtml', 'http://www.w3.org/1999/xhtml')
    .att('xmlns:image', 'http://www.google.com/schemas/sitemap-image/1.1')
    .att('xmlns:video', 'http://www.google.com/schemas/sitemap-video/1.1')
    .att('xmlns:news', 'http://www.google.com/schemas/sitemap-news/0.9')

  uniqueEntries.forEach((entry) => createUrlElement(urlset, entry))

  return doc.end({ prettyPrint: true })
}
