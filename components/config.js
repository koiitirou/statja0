const isServer = typeof window === 'undefined';
export const server = isServer
  ? 'https://storage.googleapis.com/statapi1'
  : '/statapi1';
