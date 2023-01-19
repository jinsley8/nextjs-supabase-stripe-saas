/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,

    // https://nextjs.org/docs/api-reference/next.config.js/ignoring-typescript-errors
    // Remove this once type errors are fixed
    ...(process.env.NODE_ENV === 'production' && {
        typescript: {
            ignoreBuildErrors: true,
        },
        eslint: {
            ignoreDuringBuilds: true,
        },
    }),
}

module.exports = nextConfig
