const webpack = require('webpack');
module.exports = {
    reactStrictMode: true,
    images: {
        domains: ["manhwa18.net", 'cdn.manhwa18.com', 'manhwa18.cc', 'manhwa18.com', 'manytoon.com', 'cdn4.manhwa18.com', 
            'mangagenki.com', 'i0.wp.com', 'i1.wp.com', 'i2.wp.com', 'i3.wp.com', 'i4.wp.com', 'i5.wp.com',
            'manga18.us', 'azmin.manga18.us', 'manhuascan.us', 'localhost', 'cdn.manhwaplus.net', 'cdn.toptoon69.com', 'toptoon69.com', 'manhwaplus.net'
        ],
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
