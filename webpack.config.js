const path = require('path');

module.exports = {
  mode: 'development', // or 'production' when building for release

  entry: './src/index.jsx', // your React entry point

  output: {
    path: path.resolve(__dirname, 'dist'), // where bundled files go
    filename: 'bundle.js',
  },

  resolve: {
    extensions: ['.js', '.jsx'], // so you can import without extensions
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/, // .js or .jsx files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', // transpile React and modern JS
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
    ],
  },

  devServer: {
    historyApiFallback: true,
    static: './public',
    hot: true,
  },
};