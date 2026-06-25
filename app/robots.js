export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://statja.com/sitemap_index.xml',
    host: 'https://statja.com',
  };
}
