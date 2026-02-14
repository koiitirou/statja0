const dev = process.env.NODE_ENV !== 'production';
export const server = dev
  ? 'https://storage.googleapis.com/statapi1'
  : 'https://storage.googleapis.com/statapi1';
