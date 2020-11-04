var webpack = require('webpack');
const CompressionPlugin = require("compression-webpack-plugin");
const PrerenderSPAPlugin = require('prerender-spa-plugin');
const Renderer = PrerenderSPAPlugin.PuppeteerRenderer;
const path = require('path')
module.exports = {
  lintOnSave: false,
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      return {
        plugins: [
          new CompressionPlugin({
            algorithm: 'gzip',
            test: /\.(js|css|png|)$/,
            threshold: 10240,
            deleteOriginalAssets: false, // 不删除源文件
            minRatio: 0.8 // 压缩比
          }),
          new PrerenderSPAPlugin({
            staticDir: path.join(__dirname,'dist'),
            routes: ['/', '/class/index', '/interest/index', '/cooking-food/index'],
            postProcess (renderedRoute) {
              renderedRoute.html = renderedRoute.html.replace(/(<div[^<>]*class=\"van-toast([\s\S]*?)<\/div><\/div>)/ig,'');
              return renderedRoute
            },
            renderer: new Renderer({
              inject: {
                foo: 'bar'
              },
              // headless: false,
              args: ['--no-sandbox', '--disable-setuid-sandbox'],
              // 在 main.js 中 document.dispatchEvent(new Event('render-event'))，两者的事件名称要对应上。
              renderAfterDocumentEvent: 'render-event',
              renderAfterTime: 5000,
              skipThirdPartyRequests: true,
            })
          })
        ]
      }
    }
  },
  devServer: {
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      ['/api']: {
        // target: `http://kid-dev.aukid.net:9999`,
        target: `http://kid-fat.aukid.net:20012`,
        // target: `183.129.130.2:20012`,
        changeOrigin: true,
        pathRewrite: {
          ['^/api']: ''
        }
      }
    }
  },
}