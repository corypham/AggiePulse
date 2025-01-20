const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Add the root directory as a watch folder
config.watchFolders = [
  path.resolve(__dirname, "../"), // Monorepo root
];

// Include global CSS file for nativewind
module.exports = withNativeWind(config, {
  input: path.resolve(__dirname, "./global.css"), // Adjust path to global.css
});
