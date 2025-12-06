const https = require('https');
const fs = require('fs');

function fetchPackage(name, version) {
  return new Promise((resolve, reject) => {
    https.get(`https://registry.npmjs.org/${name}/${version}`, (res) => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => {
        try {
          const pkg = JSON.parse(data);
          resolve(pkg.dist.integrity);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

(async () => {
  try {
    const iapHash = await fetchPackage('react-native-iap', '14.4.46');
    const nitroHash = await fetchPackage('react-native-nitro-modules', '0.31.10');
    fs.writeFileSync('hashes.txt', `IAP: ${iapHash}\nNITRO: ${nitroHash}\n`);
    console.log('Hashes written to hashes.txt');
  } catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
  }
})();
