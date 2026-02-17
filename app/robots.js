export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://statja.com/sitemap.xml',
    host: 'https://statja.com',
  };
}
