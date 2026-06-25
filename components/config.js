const isServer = typeof window === 'undefined';
// In dev, route server-side fetches through the local origin so that any JSON
// placed under public/statapi1/** is served locally first (afterFiles rewrite
// proxies everything else to GCS). In prod, fetch GCS directly.
const isDev = process.env.NODE_ENV !== 'production';
const devPort = process.env.PORT || '3000';
export const server = isServer
  ? isDev
    ? `http://localhost:${devPort}/statapi1`
    : 'https://storage.googleapis.com/statapi1'
  : '/statapi1';

// In dev, don't cache JSON fetches (so regenerated public/statapi1 files always show).
// In prod, cache forever (ISR static data).
export const fetchOpts = isDev ? { cache: 'no-store' } : { next: { revalidate: false } };
