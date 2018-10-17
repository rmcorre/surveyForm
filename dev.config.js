const path = require('path');
const glob = require('glob-all');
const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');
const modernizr = require('modernizr'); //eslint-disable-line
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PurifyCSSPlugin = require('purifycss-webpack');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
module.exports = {
  entry: {
    app: path.resolve(__dirname, 'src/js/main')
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[chunkhash].js'
  },
  devtool: 'eval-source-map',
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          chunks: 'all'
        }
      }
    }
  },
  plugins: [
    // new CleanWebpackPlugin(['dist'], {
    //   beforeEmit: true
    // }),
    new htmlWebpackPlugin({
      template: 'src/index.html',
      minify: {
        collapseWhitespace: true,
        conservativeCollapse: true,
        minifyCSS: true,
        minifyJS: true,
        minifyURLs: true,
        quoteCharacter: "'",
        removeComments: true,
        removeEmptyAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true
      }
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css'
    }),
    // new PurifyCSSPlugin({
    //   paths: glob.sync([
    //     path.join(__dirname, 'src/*.html'),
    //     path.join(__dirname, 'src/js/*.js')
    //   ]),
    //   purifyOptions: {
    //     whitelist: ['*cbox*', '*colorbox*', '*headroom*']
    //   }
    // }),
    new OptimizeCssAssetsPlugin()
    // new BundleAnalyzerPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [{ loader: 'babel-loader' }]
      },
      {
        test: /\.s?[ac]ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-srcsets-loader',
            options: {
              attrs: ['img:src', 'source:srcset'],
              minimize: true,
              removeAttributeQuotes: false
            }
          }
        ]
      },
      {
        test: /\.(png|jp(e*)g|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name].[ext]',
              limit: 8192,
              outputPath: 'img/'
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 65
              },
              // optipng.enabled: false will disable optipng
              optipng: {
                enabled: false
              },
              pngquant: {
                quality: '65-90',
                speed: 4
              },
              gifsicle: {
                interlaced: false
              },
              // the webp option will enable WEBP
              webp: {
                quality: 75
              }
            }
          }
        ]
      },
      {
        test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [{ loader: 'url-loader' }]
      }
      // {
      //   test: /\.modernizrrc\.js$/,
      //   use: [{ loader: 'webpack-modernizr-loader' }]
      // }
    ]
  }
  // resolve: {
  //   alias: {
  //     modernizr$: path.resolve(__dirname, '.modernizrrc.js')
  //   }
  // }
};
