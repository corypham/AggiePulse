const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Read the app.json template
const appConfigPath = path.join(__dirname, '..', 'app.json');
let appConfig = fs.readFileSync(appConfigPath, 'utf8');

// Replace environment variables
appConfig = appConfig.replace('${GOOGLE_MAPS_API_KEY_IOS}', process.env.GOOGLE_MAPS_API_KEY_IOS);
appConfig = appConfig.replace('${GOOGLE_MAPS_API_KEY_ANDROID}', process.env.GOOGLE_MAPS_API_KEY_ANDROID);

// Write the processed config
fs.writeFileSync(appConfigPath, appConfig); 