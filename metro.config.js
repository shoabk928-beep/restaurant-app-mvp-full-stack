const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Metro Node externals ko disable karein taaki Windows node:sea invalid path error na aaye
config.resolver.unstable_enablePackageExports = false;

module.exports = config;