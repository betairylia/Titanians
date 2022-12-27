const path = require('path');
module.exports = {
  entry: './src/game.ts',
  devtool: 'inline-source-map',
  devServer: {
    static:{
        directory: './dist'
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};

/* We will be running in development mode. In development mode, 
   webpack does NOT create a physical bundle.js file in the dist 
   folder so don’t be worried that it is not there. To create 
   the bundle.js file in the dist folder, run `npm run build`.
*/