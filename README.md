# 🗺️ TanStack Sitemap

> A powerful, type-safe sitemap builder for TanStack Start (Router) applications

[![npm version](https://badge.fury.io/js/tanstack-sitemap.svg)](https://badge.fury.io/js/tanstack-sitemap)[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

## ✨ Features

- 🎯 **Type-Safe**: Full TypeScript support with intelligent route parameter extraction
- 🚀 **TanStack Integration**: Built specifically for TanStack Start (Router) applications
- 🔧 **Vite Plugin**: Seamless integration with Vite build process
- 🌐 **Dynamic Routes**: Support for parameterized routes with custom data providers
- 📱 **Rich Media**: Support for images, videos, and news in sitemaps
- 🌍 **Internationalization**: Built-in support for alternate language links
- 🎨 **Flexible**: Runtime generation or build-time plugin usage

## 📦 Installation

```
# npm
npm install tanstack-sitemap

# yarn
yarn add tanstack-sitemap

# pnpm
pnpm add tanstack-sitemap

```

## 🚀 Quick Start

### Vite Plugin

Add the plugin to your `vite.config.ts`:

```
import { defineConfig } from 'vite'
import { sitemapPlugin } from 'tanstack-sitemap'

export default defineConfig({
  plugins: [
    sitemapPlugin({
      defaults: {
        baseUrl: 'https://your-site.com',
        changeFrequency: 'weekly',
        priority: 0.7,
      },
      routes: {
        '/': { priority: 1.0, changeFrequency: 'daily' },
        '/about': { priority: 0.8 },
        '/blog/$slug': {
          provideParams: async () => {
            // Fetch your blog posts
            const posts = await getBlogPosts()
            return posts.map(post => ({ slug: post.slug }))
          },
          priority: 0.6,
          changeFrequency: 'monthly'
        }
      }
    })
  ]
})

```

### Runtime Generation

Create a server route file named `sitemap[.]xml.ts` and use the `generateSitemap `function in it:

```
import { createServerFileRoute } from "@tanstack/react-start/server";
import type { FileRouteTypes } from "../routeTree.gen";
import { generateSitemap } from "tanstack-sitemap";

type Routes = FileRouteTypes["fullPaths"];

export const ServerRoute = createServerFileRoute("/sitemap.xml").methods({
  GET: async () => {

     // You can separately create the sitemap object and pass it to generateSitemap.
    const sitemapXml = await generateSitemap<Routes>({
      defaults: {
        baseUrl: "https://your-site.com",
        changeFrequency: "weekly",
        priority: 0.7,
      },
      routes: {
        "/": { priority: 1.0, changeFrequency: "daily" },
        "/about": { priority: 0.8 },
        "/blog/$slug": {
          provideParams: async () => {
            // Fetch your blog posts
            const posts = await getBlogPosts();
            return posts.map((post) => ({ slug: post.slug }));
          },
          priority: 0.6,
          changeFrequency: "monthly",
        },
      },
    });

    return new Response(sitemapXml, {
      headers: {
        "Content-Type": "text/xml",
      },
    });
  },
});
```

## 📚 Configuration

### Basic Configuration

```
interface SitemapConfig<TRoutes extends string> {
  defaults: {
    baseUrl: string
    changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
    priority?: number
    lastModified?: Date | string
  }
  routes?: {
    [K in TRoutes]?: RouteConfig<K>
  }
}

```

### Static Routes

```
{
  routes: {
    '/': {
      priority: 1.0,
      changeFrequency: 'daily',
      lastModified: new Date(),
      alternatives: [
        { hrefLang: 'en', href: 'https://example.com/en' },
        { hrefLang: 'es', href: 'https://example.com/es' }
      ]
    },
    '/about': {
      priority: 0.8,
      changeFrequency: 'monthly'
    }
  }
}

```

### Dynamic Routes

Dynamic routes use the `$parameter` syntax and require a `provideParams` function:

```
{
  routes: {
    '/blog/$slug': {
      provideParams: async () => {
        const posts = await fetch('/api/posts').then(r => r.json())
        return posts.map(post => ({ slug: post.slug }))
      },
      priority: 0.6,
      changeFrequency: 'weekly',
      // Dynamic content based on parameters
      dynamicImages: async ({ params, path }) => [
        {
          loc: `/images/blog/${params.slug}.jpg`,
          caption: `Image for ${params.slug}`,
          title: `Blog post: ${params.slug}`
        }
      ]
    },
    '/products/$category/$id': {
      provideParams: async () => {
        const products = await getProducts()
        return products.map(p => ({
          category: p.category,
          id: p.id
        }))
      }
    }
  }
}

```

## 🖼️ Rich Media Support

### Images

```
{
  routes: {
    '/gallery': {
      images: [
        {
          loc: '/images/hero.jpg',
          caption: 'Hero image',
          geoLocation: 'New York, NY',
          title: 'Beautiful sunset',
          license: 'https://creativecommons.org/licenses/by/4.0/'
        }
      ]
    }
  }
}

```

### Videos

```
{
  routes: {
    '/videos': {
      videos: [
        {
          thumbnailLoc: '/thumbnails/video1.jpg',
          title: 'Amazing Video',
          description: 'An amazing video description',
          contentLoc: '/videos/amazing.mp4',
          duration: 120,
          rating: 4.5,
          viewCount: 1000,
          familyFriendly: true,
          tags: ['amazing', 'video', 'content']
        }
      ]
    }
  }
}

```

### News

```
{
  routes: {
    '/news/$slug': {
      provideParams: async () => getNewsArticles(),
      dynamicNews: async ({ params }) => [
        {
          publicationName: 'Daily News',
          publicationLanguage: 'en',
          title: `News: ${params.slug}`,
          publicationDate: new Date(),
          keywords: 'news, breaking, update'
        }
      ]
    }
  }
}

```

## 🌍 Internationalization

```
{
  routes: {
    '/': {
      alternatives: [
        { hrefLang: 'en', href: 'https://example.com/en' },
        { hrefLang: 'es', href: 'https://example.com/es' },
        { hrefLang: 'fr', href: 'https://example.com/fr' },
        { hrefLang: 'x-default', href: 'https://example.com' }
      ]
    }
  }
}

```

## 🏗️ Advanced Usage

### Multiple Dynamic Parameters

```
{
  routes: {
    '/blog/$year/$month/$slug': {
      provideParams: async () => {
        const posts = await getBlogPosts()
        return posts.map(post => ({
          year: post.publishedAt.getFullYear().toString(),
          month: (post.publishedAt.getMonth() + 1).toString().padStart(2, '0'),
          slug: post.slug
        }))
      }
    }
  }
}

```

### Conditional Route Generation

```
{
  routes: {
    '/products/$id': {
      provideParams: async () => {
        const products = await getProducts()
        // Only include published products
        return products
          .filter(product => product.status === 'published')
          .map(product => ({ id: product.id }))
      }
    }
  }
}

```

### Custom Last Modified Dates

```
{
  routes: {
    '/blog/$slug': {
      provideParams: async () => getBlogPosts(),
      // Set lastModified per route
      lastModified: async ({ params }) => {
        const post = await getBlogPost(params.slug)
        return post.updatedAt
      }
    }
  }
}

```

## 🔧 API Reference

### `generateSitemap(config: SitemapConfig)`

Generates a sitemap XML string based on the provided configuration.

**Returns:** `Promise<string>` - The generated sitemap XML

### `sitemapPlugin(config: SitemapConfig)`

Vite plugin that generates a sitemap during the build process.

**Returns:** `Plugin` - Vite plugin instance

### Type Definitions

```
// Route parameter extraction (automatic)
type ExtractParams<'/blog/$slug'> = { slug: string }
type ExtractParams<'/shop/$category/$id'> = { category: string; id: string }

// Route configuration types
interface BaseSitemapEntry {
  changeFrequency?: ChangeFrequency
  priority?: number
  lastModified?: Date | string
  alternatives?: AlternateLink[]
  images?: SitemapImage[]
  videos?: SitemapVideo[]
  news?: SitemapNews[]
}

interface DynamicRouteConfig<T extends Record<string, string>> extends BaseSitemapEntry {
  provideParams: () => Array<T> | Promise<Array<T>>
  dynamicAlternatives?: (context: { params: T; path: string }) => AlternateLink[] | Promise<AlternateLink[]>
  dynamicImages?: (context: { params: T; path: string }) => SitemapImage[] | Promise<SitemapImage[]>
  dynamicVideos?: (context: { params: T; path: string }) => SitemapVideo[] | Promise<SitemapVideo[]>
  dynamicNews?: (context: { params: T; path: string }) => SitemapNews[] | Promise<SitemapNews[]>
}

```

## 📋 Examples

### E-commerce Store

```
sitemapPlugin({
  defaults: {
    baseUrl: 'https://shop.example.com',
    changeFrequency: 'weekly',
    priority: 0.5,
  },
  routes: {
    '/': { priority: 1.0, changeFrequency: 'daily' },
    '/products': { priority: 0.9 },
    '/products/$category': {
      provideParams: async () => {
        const categories = await getCategories()
        return categories.map(cat => ({ category: cat.slug }))
      },
      priority: 0.8
    },
    '/products/$category/$slug': {
      provideParams: async () => {
        const products = await getProducts()
        return products.map(p => ({
          category: p.category.slug,
          slug: p.slug
        }))
      },
      priority: 0.7,
      dynamicImages: async ({ params }) => {
        const product = await getProduct(params.slug)
        return product.images.map(img => ({
          loc: img.url,
          caption: img.alt,
          title: product.name
        }))
      }
    }
  }
})

```

### Blog with Categories

```
sitemapPlugin({
  defaults: {
    baseUrl: 'https://blog.example.com',
    changeFrequency: 'weekly',
  },
  routes: {
    '/': { priority: 1.0, changeFrequency: 'daily' },
    '/blog': { priority: 0.9 },
    '/blog/category/$category': {
      provideParams: async () => {
        const categories = await getCategories()
        return categories.map(cat => ({ category: cat.slug }))
      },
      priority: 0.8
    },
    '/blog/$slug': {
      provideParams: async () => {
        const posts = await getPosts()
        return posts.map(post => ({ slug: post.slug }))
      },
      priority: 0.7,
      changeFrequency: 'monthly',
      dynamicAlternatives: async ({ params }) => {
        const post = await getPost(params.slug)
        return post.translations.map(t => ({
          hrefLang: t.language,
          href: `https://blog.example.com/${t.language}/blog/${t.slug}`
        }))
      }
    }
  }
})

```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](https://claude.ai/chat/CONTRIBUTING.md) for details.

### Development Setup

```
# Clone the repository
git clone https://github.com/your-username/tanstack-sitemap.git
cd tanstack-sitemap

# Install dependencies
pnpm install

# Run tests
pnpm test

# Build the package
pnpm build

# Run formating
pnpm format

# Run linting
pnpm lint



```

## 📄 License

MIT © [Amir Akbarpour](https://github.com/AmirAkbarpour1)

## 🙏 Acknowledgments

- Built for the [TanStack](https://tanstack.com/) ecosystem
- XML generation by [xmlbuilder2](https://oozcitak.github.io/xmlbuilder2/)

## 📞 Support

- 🐛 [Report Issues](https://github.com/AmirAkbarpour1/tanstack-sitemap/issues)
- 💬 [Discussions](https://github.com/AmirAkbarpour1/tanstack-sitemap/discussions)
- 🐦 [Follow on X ](https://X.com/AmirAkbarpour1)

---

\<div align="center"> \<strong>Made with ❤️ for the TanStack community\</strong> \</div>
