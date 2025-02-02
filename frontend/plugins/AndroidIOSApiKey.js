const { withAndroidManifest, withInfoPlist } = require("@expo/config-plugins");
const dotenv = require("dotenv");

// Load .env file
dotenv.config();

const withAndroidIOSApiKey = (config) => {
  // Ensure the config gets modified first
  config = withAndroidManifest(config, async (config) => {
    // Add Android API key
    config.modResults.manifest.application[0]["meta-data"] = [
      {
        $: {
          "android:name": "com.google.android.geo.API_KEY",
          "android:value": process.env.GOOGLE_MAPS_API_KEY,
        },
      },
    ];
    return config;
  });

  // Modify iOS config
  config = withInfoPlist(config, (config) => {
    // Add iOS API key
    config.modResults.NSLocationWhenInUseUsageDescription =
      "Allow AggiePulse to use your location.";
    config.modResults.NSLocationAlwaysAndWhenInUseUsageDescription =
      "Allow AggiePulse to use your location.";
    return config;
  });

  return config;
};

module.exports = withAndroidIOSApiKey;