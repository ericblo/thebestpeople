// next.config.mjs
const nextConfig = {
  basePath: '/thebestpeople',
  async redirects() {
    return [
      {
        source: '/',
        destination: '/thebestpeople',
        permanent: true,
        basePath: false, // This allows the redirect to work from the actual root
      },
    ]
  },
}
