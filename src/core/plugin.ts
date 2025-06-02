import fs from 'node:fs'
import path from 'node:path'
import type { Plugin } from 'vite'
import type { SitemapConfig } from '~/core/types'
import { generateSitemap } from '~/core/generate'

export function sitemapPlugin<TRoutes extends string>(
  config: SitemapConfig<TRoutes>,
): Plugin {
  return {
    name: 'vite-plugin-tanstack-sitemap',
    apply: 'build',

    async closeBundle() {
      const sitemap = await generateSitemap(config)
      const publicDir = path.resolve(process.cwd(), 'public')

      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true })
      }

      fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap)
      console.log('✅ Sitemap generated at public/sitemap.xml')
    },
  }
}
