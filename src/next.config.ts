import type { NextConfig } from 'next'
import type { Configuration as WebpackConfiguration } from 'webpack'

const nextConfig: NextConfig = {
  serverActions: {
    allowedOrigins: [
      'https://6000-firebase-studio-1749905570510.cluster-htdgsbmflbdmov5xrjithceibm.cloudworkstations.dev',
      'http://localhost:9002',
    ],
    bodySizeLimit: '5mb',
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
      config.resolve = config.resolve || {}
      config.resolve.fallback = {
        ...(config.resolve.fallback || {}),
        child_process: false,
        fs: false,
        tls: false,
        net: false,
        dns: false,
        'timers/promises': false,
      }
    }
    return config
  },
}

export default nextConfig
