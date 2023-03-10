module.exports = {
  reactStrictMode: true,
  // '@douyinfe/semi-illustrations'
  transpilePackages: ['@douyinfe/semi-ui', '@douyinfe/semi-icons'],
  env: {
    NEXT_PUBLIC_ANALYTICS_ID: 'prod',
  },
  "pipeline": {
    "build": {
      "env": [
        "NEXT_PUBLIC_ANALYTICS_ID"
      ]
    }
  },
  "globalDependencies": [
    ".env.prod",
    ".env", // contents will impact hashes of all tasks
    // "tsconfig.json" // contents will impact hashes of all tasks
  ],
  async rewrites() {
    return {
      // After checking all Next.js pages (including dynamic routes)
      // and static files we proxy any other requests
      fallback: [
        {
          source: '/:path*',
          // destination: `https://config.aioschat.com/:path*`,
          destination: `https://test.pandateacher.com/:path*`,
          // source: '/biz',
          // destination: `https://test.pandateacher.com/biz`,
        },
      ],
    }
  },
};
