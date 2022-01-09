const webpack = require('webpack');
module.exports = {
    reactStrictMode: true,
    images: {
        domains: ["manhwa18.net", 'cdn.manhwa18.com', 'manhwa18.cc', 'manytoon.com', 'cdn4.manhwa18.com'],
    },
    async rewrites() {
        return [
            {
                source: '/manga-:slug',
                destination: '/manga',
            }
        ]
    },
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        if (!isServer) {
          config.resolve.fallback.fs = false;
        }
        config.plugins.push(new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
        }))
        return config;
    },
};
