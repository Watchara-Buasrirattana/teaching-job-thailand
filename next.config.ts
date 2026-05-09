import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'upload.teachingjobthailand.com',
            },
        ],
    },
    experimental: {
        serverActions: {
            bodySizeLimit: '20mb',
        },
    },
}

export default withNextIntl(nextConfig)