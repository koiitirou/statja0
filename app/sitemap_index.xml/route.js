import { generateSitemaps } from '../sitemap';

const SITE_URL = 'https://statja.com';

// Next 15 の generateSitemaps() は /sitemap/[id].xml を配信するが /sitemap.xml(インデックス)
// は自動生成しない。ここでチャンク群を束ねる sitemapindex を /sitemap_index.xml で配信する。
export const dynamic = 'force-static';

export async function GET() {
  const maps = await generateSitemaps();
  const now = new Date().toISOString();
  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    maps
      .map(
        ({ id }) =>
          `<sitemap><loc>${SITE_URL}/sitemap/${id}.xml</loc><lastmod>${now}</lastmod></sitemap>`,
      )
      .join('\n') +
    `\n</sitemapindex>\n`;
  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
