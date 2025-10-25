module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Temporarily removed reanimated plugin to fix errors
      // 'react-native-reanimated/plugin',
    ],
  };
};
