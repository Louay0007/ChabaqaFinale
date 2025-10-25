const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add support for reanimated
config.resolver.alias = {
  ...config.resolver.alias,
};

module.exports = config;
