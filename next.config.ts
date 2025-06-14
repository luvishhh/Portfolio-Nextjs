import type {NextConfig} from 'next';
import type {Configuration as WebpackConfiguration} from 'webpack';

const nextConfig: NextConfig = {
  /* config options here */
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
      // Prevent these modules from being bundled on the client
      // as they are Node.js specific and not available in the browser.
      // The mongodb driver might try to pull them in for features like
      // client-side field-level encryption, which are not used here.
      config.resolve = {
        ...config.resolve,
        fallback: {
          ...config.resolve?.fallback, // Preserve existing fallbacks
          child_process: false,
          fs: false,
          tls: false,
          net: false,
          dns: false,
        },
      };
    }
    return config;
  },
};

export default nextConfig;
