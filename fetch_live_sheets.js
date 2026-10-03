const https = require('https');
const fs = require('fs');

const sheetId = '1jsDG5NQJ7lc1SfOS2Hz0aXpBvCwcTQYYTc39H5SKmVA';
const url = `https://docs.google.com/spreadsheets/d/${sheetId}/htmlview`;

function fetchUrl(targetUrl) {
  return new Promise((resolve, reject) => {
    https.get(targetUrl, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(fetchUrl(res.headers.location));
      }
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve(body));
    }).on('error', reject);
  });
}

async function main() {
  try {
    const html = await fetchUrl(url);
    fs.writeFileSync('htmlview_sample.html', html.substring(0, 20000), 'utf-8');
    // Search for sheet names or buttons
    const matches1 = [...html.matchAll(/id="sheet-button-([^"]+)"[^>]*>([^<]+)/g)];
    const matches2 = [...html.matchAll(/name="([^"]+)"[^>]*id="sheet-button-/g)];
    const matches3 = [...html.matchAll(/gid=([0-9]+)/g)];
    console.log('matches1:', matches1.map(m => m[0]));
    console.log('unique gids:', [...new Set(matches3.map(m => m[1]))]);


    const gids = ['0', '76073810', '1404826480', '1467183359'];
    for (const gid of gids) {
      const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
      console.log(`Downloading gid ${gid}...`);
      const csvData = await fetchUrl(csvUrl);
      const filename = `sheet_live_gid_${gid}.csv`;
      fs.writeFileSync(filename, csvData, 'utf-8');
      console.log(`Saved ${filename} (${csvData.length} bytes), first line: ${csvData.split('\n')[0]}`);
    }
  } catch (err) {
    console.error('Error fetching sheets:', err);
  }
}

main();
