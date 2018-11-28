const path = require('path');
const webpack = require( 'webpack');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const os = require("os");

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: ''
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.css', '.scss']
  },
  module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env','react','es2015','stage-0'],
                    }
                },
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
        ]
  },
  watch: true,
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM'
  },
  devtool: false,
  devServer: {
    //hot: true,
    inline: true,
    host: '127.0.0.1',
    port: 8082,
    historyApiFallback: true,
      disableHostCheck: true,
      // proxy: {
      //     '/api/*': {
      //         target: 'http://127.0.0.1:3001',
      //         changeOrigin: true,
      //         secure: false,
      //     }
      // }
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin({
      compress: {
        drop_console: true,
        dead_code: true
      }
    }),
    new ProgressBarPlugin({
      format: 'build [:bar] :percent (:elapsed seconds)',
      clear: false,
      width: 60
    }),
    new UglifyJSPlugin()
  ]
};
