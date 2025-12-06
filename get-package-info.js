const https = require('https');

function getPackageInfo(packageName, version) {
  return new Promise((resolve, reject) => {
    https.get(`https://registry.npmjs.org/${packageName}/${version}`, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const pkg = JSON.parse(data);
          resolve({
            version: pkg.version,
            resolved: pkg.dist.tarball,
            integrity: pkg.dist.integrity,
            license: pkg.license || 'MIT'
          });
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  try {
    const iap = await getPackageInfo('react-native-iap', '14.4.46');
    console.log('react-native-iap:', JSON.stringify(iap, null, 2));
    
    const nitro = await getPackageInfo('react-native-nitro-modules', '0.31.10');
    console.log('react-native-nitro-modules:', JSON.stringify(nitro, null, 2));
  } catch (e) {
    console.error('Error:', e);
    process.exit(1);
  }
}

main();
