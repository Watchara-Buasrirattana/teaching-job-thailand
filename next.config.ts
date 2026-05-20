import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
    images: {
        formats: ['image/avif', 'image/webp'],
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
        optimizePackageImports: ['lucide-react', 'react-icons', 'framer-motion'],
    },
}

export default withNextIntl(nextConfig)