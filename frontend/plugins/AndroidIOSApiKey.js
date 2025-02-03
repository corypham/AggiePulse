const { withAndroidManifest, withInfoPlist } = require("@expo/config-plugins");
const dotenv = require("dotenv");

// Load .env file
dotenv.config();

const withAndroidIOSApiKey = (config) => {
  // Modify Android config
  config = withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults;
    const mainApplication = androidManifest.manifest.application[0];

    // Remove any existing Google Maps API key metadata
    mainApplication['meta-data'] = mainApplication['meta-data'].filter(
      (metadata) => metadata.$['android:name'] !== 'com.google.android.geo.API_KEY'
    );

    // Add the new API key
    mainApplication['meta-data'].push({
      $: {
        "android:name": "com.google.android.geo.API_KEY",
        "android:value": process.env.GOOGLE_MAPS_API_KEY_ANDROID
      }
    });

    return config;
  });

  // Modify iOS config
  config = withInfoPlist(config, (config) => {
    // Add Google Maps API key
    config.modResults.GMSApiKey = process.env.GOOGLE_MAPS_API_KEY_IOS;
    config.modResults.GMSStyleId = process.env.GOOGLE_MAPS_STYLE_ID;
    
    // Add required location usage descriptions
    config.modResults.NSLocationWhenInUseUsageDescription = 
      "AggiePulse needs your location to show nearby facilities";
    config.modResults.NSLocationAlwaysAndWhenInUseUsageDescription = 
      "AggiePulse needs your location to show nearby facilities";
    
    return config;
  });

  return config;
};

module.exports = withAndroidIOSApiKey;