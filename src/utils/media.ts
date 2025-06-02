import { buildUrl } from '~/utils/path'

export const processMedia = (items: Array<any>, baseUrl: string) =>
  items.map((item) => ({
    ...item,
    loc: item.loc ? buildUrl(item.loc, baseUrl) : undefined,
    href: item.href ? buildUrl(item.href, baseUrl) : undefined,
    thumbnailLoc: item.thumbnailLoc
      ? buildUrl(item.thumbnailLoc, baseUrl)
      : undefined,
    contentLoc: item.contentLoc
      ? buildUrl(item.contentLoc, baseUrl)
      : undefined,
    playerLoc: item.playerLoc ? buildUrl(item.playerLoc, baseUrl) : undefined,
    galleryLoc: item.galleryLoc
      ? buildUrl(item.galleryLoc, baseUrl)
      : undefined,
    license: item.license ? buildUrl(item.license, baseUrl) : undefined,
  }))
