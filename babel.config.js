module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@config': './src/config',
          '@core': './src/core',
          '@navigation': './src/navigation',
          '@store': './src/store',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
