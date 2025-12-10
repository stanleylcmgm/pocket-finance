// Script to create the minimal react-native-iap plugin file
// This is needed because the build files were deleted by a patch
const fs = require('fs');
const path = require('path');

const pluginDir = path.join(__dirname, '..', 'node_modules', 'react-native-iap', 'plugin', 'build');
const pluginFile = path.join(pluginDir, 'withIAP.js');

// Create directory if it doesn't exist
if (!fs.existsSync(pluginDir)) {
  fs.mkdirSync(pluginDir, { recursive: true });
}

// Create minimal plugin file
const pluginContent = `// Minimal plugin wrapper - react-native-iap native module should work without full plugin configuration
// This is a pass-through to allow Expo prebuild to succeed
module.exports = function withIAP(config) {
  // The native module should work without additional configuration
  // If you need Android dependencies, they should be added manually to build.gradle
  return config;
};
`;

fs.writeFileSync(pluginFile, pluginContent, 'utf8');
console.log('✅ Created react-native-iap plugin file:', pluginFile);

