export const buildUrl = (path: string, baseUrl: string): string =>
  path.startsWith('http')
    ? path
    : `${baseUrl.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`

export const normalizePath = (path: string): string => {
  if (!path || path === '/') return path
  const normalized = path.replace(/\/+/g, '/')
  return normalized.length > 1 && normalized.endsWith('/')
    ? normalized.slice(0, -1)
    : normalized
}
