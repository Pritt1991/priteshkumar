import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://priteshkumar.com',
  output: 'static',
  devToolbar: { enabled: false },
  redirects: {
    '/blog/-after-14-years-in-it-infrastructure-security-and-cloud-i-finally-built-a-home-for-it-all': '/blog/after-14-years-in-it-infrastructure-security-and-cloud-i-finally-built-a-home-for-it-all',
  },
  integrations: [
    tailwind(),
    sitemap({
      filter: (page) => !page.includes('/404'),
    }),
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
});