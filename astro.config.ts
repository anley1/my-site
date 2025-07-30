import { defineConfig } from 'astro/config';
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { remarkReadingTime } from './src/scripts/readingTime.ts';
import remarkToc from 'remark-toc';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis';
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeExternalLinks from "rehype-external-links";
import rehypeUnwrapImages from "rehype-unwrap-images";
import tailwind from "@astrojs/tailwind";


// https://astro.build/config
export default defineConfig({
  site: 'https://www.alexleye.com',
  integrations: [
    mdx({
      remarkPlugins: [[remarkToc, { heading: "contents", maxDepth: 4 }], remarkReadingTime, remarkMath],
      rehypePlugins: [
        rehypeAccessibleEmojis, 
        rehypeKatex, 
        rehypeUnwrapImages,
        [
          rehypeExternalLinks,
          {
            rel: ["noreferrer", "noopener"],
            target: "_blank",
          },
        ],
      ],
    }),
    sitemap(), 
    tailwind()
  ],
});