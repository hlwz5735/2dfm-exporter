// eslint-disable-next-line @typescript-eslint/no-var-requires
const { modifyVars } = require('./build/less-modify-vars')

module.exports = {
  lintOnSave: true,

  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars,
          javascriptEnabled: true
        }
      }
    }
  },

  pluginOptions: {
    electronBuilder: {
      preload: './src/preload.ts',
      mainProcessFile: './src/main.ts',
      rendererProcessFile: './src/renderer.ts'
    },
    quasar: {
      importStrategy: 'kebab',
      rtlSupport: false
    }
  },

  transpileDependencies: [
    'quasar'
  ]
}
