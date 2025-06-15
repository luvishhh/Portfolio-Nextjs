import type { NextConfig } from 'next'
import type { Configuration as WebpackConfiguration } from 'webpack'

const nextConfig: NextConfig = {
  /* config options here */
  serverActions: {
    allowedOrigins: [
      'https://6000-firebase-studio-1749905570510.cluster-htdgsbmflbdmov5xrjithceibm.cloudworkstations.dev',
    ],
    bodySizeLimit: '5mb', // Increased body size limit
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config: WebpackConfiguration, { isServer }) => {
    if (!isServer) {
      // Ensure config.resolve and config.resolve.fallback objects exist before modifying
      config.resolve = config.resolve || {}
      config.resolve.fallback = {
        ...(config.resolve.fallback || {}), // Preserve existing fallbacks
        child_process: false,
        fs: false,
        tls: false,
        net: false,
        dns: false,
        'timers/promises': false, // Added timers/promises
      }
    }
    return config
  },
}

export default nextConfig
