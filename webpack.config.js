const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync({
    ...env,
    babel: {
      dangerouslyAddModifiedFiles: true
    },
    mode: env.mode === 'development' ? 'development' : 'production',
    optimization: {
      minimize: true
    },
    performance: {
      maxEntrypointSize: 900000,
      maxAssetSize: 900000
    }
  }, argv);
  
  // Add file-loader for image assets
  config.module.rules.push({
    test: /\.(png|jpe?g|gif|ico)$/i,
    use: [
      {
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'assets'
        }
      }
    ]
  });

  // Copy favicon to output
  config.plugins.push(
    new (require('copy-webpack-plugin'))({
      patterns: [
        {
          from: path.resolve(__dirname, 'public/favicon.ico'),
          to: path.resolve(__dirname, 'dist')
        }
      ]
    })
  );
  
  return config;
}; 