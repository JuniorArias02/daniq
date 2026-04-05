const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Soportar archivos WASM para SQLite en Web
config.resolver.assetExts.push("wasm");

// Asegurar resolución de extensiones en Windows/Metro
config.resolver.sourceExts = [
  ...config.resolver.sourceExts,
  "mjs",
  "js",
  "jsx",
  "ts",
  "tsx",
  "json"
];

module.exports = withNativeWind(config, { input: "./global.css" });

