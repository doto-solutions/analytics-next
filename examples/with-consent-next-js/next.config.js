const getEnv = () => {
  try {
    return require('./.env.local.js')
  } catch (e) {
    // ignore
  }
}
/** @type {import('next').NextConfig} */
const nextConfig = {
  publicRuntimeConfig: getEnv(),
  reactStrictMode: false,
}

module.exports = nextConfig
