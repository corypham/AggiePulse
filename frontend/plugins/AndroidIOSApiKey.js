const { withAndroidManifest, withInfoPlist } = require("@expo/config-plugins");
const dotenv = require("dotenv");

// Load .env file
dotenv.config();

const withAndroidIOSApiKey = (config) => {
  // Modify Android config
  config = withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults;
    const mainApplication = androidManifest.manifest.application[0];

    mainApplication['meta-data'] = mainApplication['meta-data'] || [];
    mainApplication['meta-data'].push({
      $: {
        "android:name": "com.google.android.geo.API_KEY",
        "android:value": process.env.GOOGLE_MAPS_API_KEY,
      },
    });

    return config;
  });

  // Modify iOS config
  config = withInfoPlist(config, (config) => {
    config.modResults.GMSApiKey = process.env.GOOGLE_MAPS_API_KEY;
    return config;
  });

  return config;
};

module.exports = withAndroidIOSApiKey;