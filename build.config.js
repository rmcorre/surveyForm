const path = require('path');
const glob = require('glob-all');
const webpack = require('webpack'); //eslint-disable-line
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const htmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const InlineSourcePlugin = require('html-webpack-inline-source-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PurifyCSSPlugin = require('purifycss-webpack');
const HtmlCriticalWebpackPlugin = require('html-critical-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const DuplicatPackageCheckerWebpackPlugin = require('duplicate-package-checker-webpack-plugin');
const postcssPresetEnv = require('postcss-preset-env');

module.exports = {
  entry: {
    app: path.resolve(__dirname, 'src/js/main')
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[chunkhash].js'
  },
  optimization: {
    runtimeChunk: true,
    splitChunks: {
      cacheGroups: {
        commons: {
          chunks: 'all'
        }
      }
    },
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: false
      }),
      new OptimizeCssAssetsPlugin()
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist'], {
      beforeEmit: true
    }),
    new webpack.HashedModuleIdsPlugin(),
    new htmlWebpackPlugin({
      template: 'src/index.html',
      // Inline all files which names start with “runtime~” and end with “.js”.
      // That’s the default naming of runtime chunks
      inlineSource: 'runtime~.+\\.js',
      minify: {
        // Does not minify html here.
        // Use minimize on html-loader instead.
        collapseWhitespace: true,
        conservativeCollapse: true,
        minifyCSS: true,
        minifyJS: true,
        minifyURLs: true,
        quoteCharacter: "'", //eslint-disable-line
        removeComments: true,
        removeEmptyAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true
      }
    }),
    // This plugin enables the “inlineSource” option on the html-webpack-plugin
    // to inline scripts in the html
    new InlineSourcePlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css'
    }),
    new PurifyCSSPlugin({
      paths: glob.sync([
        path.join(__dirname, 'src/*.html'),
        path.join(__dirname, 'src/js/*.js')
      ]),
      purifyOptions: {
        info: true
      }
    }),
    //******** Had to disable because of penthouse issues ****************
    // new HtmlCriticalWebpackPlugin({
    //   //Operates on file system therefore acts as a post build plugin
    //   //Watch for css values that have a leading zero.
    //   //Critical removes leading zeros from inlined styles which
    //   //causes problems when extracting inlined styles from
    //   //src css since styles don't match.
    //   //Use with optimize-css-assets-webpack-plugin to remove
    //   //leading zeros from src css.
    //   base: path.resolve(__dirname, 'dist'),
    //   src: 'index.html',
    //   dest: 'index.html',
    //   inline: true,
    //   minify: true,
    //   extract: true,
    //   width: 375,
    //   height: 575,
    //   timeout: 40000,
    //   penthouse: {
    //     blockJSRequests: false
    //   }
    // }),
    new CompressionWebpackPlugin({
      //Pre-compressing html here removes inlined styles emitted
      //by html-critical-webpack-plugin. Compress on the
      //server instead.
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.js$|\.css$/,
      threshold: 0,
      minRatio: 0.9
    }),
    new BundleAnalyzerPlugin(),
    new FriendlyErrorsWebpackPlugin(),
    new DuplicatPackageCheckerWebpackPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [{ loader: 'babel-loader' }]
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { importLoaders: 1 } },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: () => [postcssPresetEnv()]
            }
          }
        ]
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              minimize: true,
              removeAttributeQuotes: false
            }
          }
        ]
      },
      {
        test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [{ loader: 'url-loader' }]
      }
    ]
  }
};
