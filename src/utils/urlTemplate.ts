export const isDynamic = (route: string): boolean => route.includes('$')

export const buildDynamicUrl = (
  template: string,
  params: Record<string, string>,
): string => {
  let url = template
  Object.entries(params).forEach(([key, value]) => {
    url = url.replace(`$${key}`, encodeURIComponent(value))
  })
  return url
}
