import { defineConfig } from 'astro/config';
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import preact from "@astrojs/preact";
import { remarkReadingTime } from './src/scripts/readingTime.ts';
import remarkToc from 'remark-toc';
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis';

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  site: 'https://axleydev.netlify.app',
  integrations: [mdx(), sitemap(), preact(), tailwind()],
  markdown: {
    remarkPlugins: [remarkToc, remarkReadingTime],
    rehypePlugins: [rehypeAccessibleEmojis],
  },
});