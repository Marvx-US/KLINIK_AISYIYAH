const { SERVICES_DATA } = require('./src/data/services.ts');
const https = require('https');
const http = require('http');

async function checkUrl(url) {
  return new Promise((resolve) => {
    if (!url.startsWith('http')) return resolve({ url, status: 'local' });
    const req = (url.startsWith('https') ? https : http).get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      resolve({ url, statusCode: res.statusCode });
    });
    req.on('error', (e) => resolve({ url, error: e.message }));
    req.setTimeout(5000, () => { req.destroy(); resolve({ url, error: 'timeout' }); });
  });
}

async function main() {
  console.log('Checking all service gallery image URLs...');
  for (const [key, svc] of Object.entries(SERVICES_DATA)) {
    console.log(`\nService: ${key}`);
    console.log(`Hero:`, await checkUrl(svc.heroImage));
    for (const g of svc.gallery) {
      console.log(`Gallery item:`, await checkUrl(g));
    }
  }
}

main();
