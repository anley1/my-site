import { defineConfig } from 'astro/config';
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { remarkReadingTime } from './src/scripts/readingTime.ts';
import remarkToc from 'remark-toc';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import expressiveCode from 'astro-expressive-code';
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeExternalLinks from "rehype-external-links";
import rehypeUnwrapImages from "rehype-unwrap-images";
import { rehypeHeadingIds } from "@astrojs/markdown-remark";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  site: 'https://www.alexleye.com',
  integrations: [
    expressiveCode({
      themes: ["github-dark", "dracula"],
      themeCssSelector: (theme) => `[data-theme="${theme.name}"]`,
      styleOverrides: {
        codeFontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
      },
    }),
    mdx(),
    sitemap(), 
    tailwind(),
  ],
  markdown: {
    remarkPlugins: [[remarkToc, { heading: "contents", maxDepth: 4 }], remarkReadingTime, remarkMath],
    rehypePlugins: [
      rehypeKatex, 
			rehypeHeadingIds,
			[rehypeAutolinkHeadings, { behavior: "wrap", properties: { className: ["not-prose"] } }],
			[
				rehypeExternalLinks,
				{
					rel: ["noreferrer", "noopener"],
					target: "_blank",
				},
			],
			rehypeUnwrapImages,
    ],
  }
});