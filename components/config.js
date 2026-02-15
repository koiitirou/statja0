const dev = process.env.NODE_ENV !== 'production';
const isServer = typeof window === 'undefined';
export const server = dev || isServer
  ? 'https://storage.googleapis.com/statapi1'
  : '/statapi1';
