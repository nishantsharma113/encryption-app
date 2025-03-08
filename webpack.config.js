const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync({
    ...env,
    babel: {
      dangerouslyAddModifiedFiles: true
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
  
  return config;
}; 