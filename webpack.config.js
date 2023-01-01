const path = require('path');
const WebpackShellPluginNext = require('webpack-shell-plugin-next');

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
  },
  plugins: [
    new WebpackShellPluginNext({
      // onBuildStart:{
      //   scripts: ['echo "Webpack Start"'],
      //   blocking: true,
      //   parallel: false
      // }, 
      onDoneWatch: {
        scripts: ['typescript-json-schema .\\tsconfig.json BuildingDataSheet --ignoreErrors --out .\\dist\\data\\buildings-schema.json', 'echo [JSON-SCHEMA] Writing: buildings-schema.json', 'typescript-json-schema .\\tsconfig.json ResourceDataSheet --ignoreErrors --out .\\dist\\data\\resources-schema.json', 'echo [JSON-SCHEMA] Writing: resources-schema.json'],
        blocking: false,
        parallel: true
      }
    })
  ]
};

/* We will be running in development mode. In development mode, 
   webpack does NOT create a physical bundle.js file in the dist 
   folder so don’t be worried that it is not there. To create 
   the bundle.js file in the dist folder, run `npm run build`.
*/