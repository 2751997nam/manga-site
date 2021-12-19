module.exports = {
    reactStrictMode: true,
    images: {
        domains: ["manhwa18.net", 'cdn.manhwa18.com'],
    },
    async rewrites() {
        return [
            {
                source: '/manga-:slug',
                destination: '/manga',
            }
        ]
    },
    webpack: (config, { isServer }) => {
        if (!isServer) {
          config.resolve.fallback.fs = false;
        }
        return config;
    },
};
