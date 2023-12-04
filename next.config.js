/** @type {import('next').NextConfig} */

const nextConfig = {
    webpack(config) {
      config.module.rules.push({
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        use: ['@svgr/webpack'],
      })
      config.resolve.fallback = { fs: false }
  
      return config
    },
    reactStrictMode: true,
    swcMinify: true,
    transpilePackages: ['@lifi/widget', '@lifi/wallet-management'],
    i18n: {
      locales: ["en"],
      defaultLocale: "en",
    },
    images: {
      remotePatterns: [{
        protocol: 'https',	
        hostname: "lh3.googleusercontent.com/**",
        // pathname: '/account'
      },
      {
        protocol: 'https',
        hostname: 'www.cryptotimes.io/**'
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com'
      },
      {
        protocol: 'https',
        hostname: 'static.debank.com'
      },
      {
        protocol: 'https',
        hostname: 'assets.coingecko.com'
      },
      {
        protocol: 'https',
        hostname: 's2.coinmarketcap.com'
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com'
      },
      {
        protocol: 'https',
        hostname: 'token-icons.s3.amazonaws.com'
      },
      {
        protocol: 'https',
        hostname: 's3.amazonaws.com'
      },
      {
        protocol: 'https',
        hostname: 'fuselogo.s3.eu-central-1.amazonaws.com'
      },
      {
        protocol: 'https',
        hostname: 's3-symbol-logo.tradingview.com'
      },
      {
        protocol: 'https',
        hostname: 'assets.coincap.io'
      },
      {
        protocol: 'https',
        hostname: "www.nexlabs.io/**" || "www.site-xi-nine.vercel.app/**",
    }],
    },
    
  
  };

module.exports = nextConfig
