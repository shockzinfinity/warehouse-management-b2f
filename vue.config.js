module.exports = {
  transpileDependencies: ['vuetify'],
  pwa: {
    themeColor: '#42b983',
    msTileColor: '#42b983',
    appleMobileWebAppCache: 'yes',
    manifestOptions: {
      background_color: '#42b983',
      start_url: '/?utm_source=homescreen',
      display: 'standalone',
      name: 'warehouse-management-b2f',
      short_name: 'wmsPWA',
      theme_color: '#42b983',
      icons: [
        {
          src: './img/icons/android-chrome-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: './img/icons/android-chrome-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: './img/icons/android-chrome-maskable-192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: './img/icons/android-chrome-maskable-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    },
    workboxOptions: {
      offline: false,
    },
  },
}
