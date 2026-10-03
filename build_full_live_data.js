const fs = require('fs');

function parseCSV(text) {
  const p = [];
  let row = [''];
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i+1];
    if (c === '"') {
      if (inQuotes && next === '"') {
        row[row.length - 1] += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      row.push('');
    } else if ((c === '\r' || c === '\n') && !inQuotes) {
      if (c === '\r' && next === '\n') i++;
      p.push(row);
      row = [''];
    } else {
      row[row.length - 1] += c;
    }
  }
  if (row.length > 1 || row[0] !== '') p.push(row);
  return p;
}

// 1. Sheet 0 (Tab 1: Courses)
const csv0 = fs.readFileSync('sheet_live_gid_0.csv', 'utf-8');
const rows0 = parseCSV(csv0);
const courses = [];
const instructors = new Set();

for (let i = 1; i < rows0.length; i++) {
  const r = rows0[i];
  if (!r[0] && !r[1] && !r[2]) continue;
  const inst = (r[4] || '').trim();
  if (inst) instructors.add(inst);

  courses.push({
    rowIndex: i + 1,
    order: (r[0] || '').trim() || String(i),
    code: (r[1] || '').trim(),
    name: (r[2] || '').trim(),
    credit: (r[3] || '').trim(),
    instructor: inst,
    plos: (r[5] || '').trim(),
    cloTh: (r[6] || '').trim(),
    cloEn: (r[7] || '').trim(),
    k: (r[8] || '').trim(),
    s: (r[9] || '').trim(),
    a: (r[10] || '').trim(),
    category: 'หมวดวิชาเฉพาะ (เทคโนโลยีดิจิทัลและสื่อสารการศึกษา)'
  });
}

// 2. Sheet 1404826480 (Tab 2: PLOs to KSA)
const csv2 = fs.readFileSync('sheet_live_gid_1404826480.csv', 'utf-8');
const rows2 = parseCSV(csv2);
const tab2Data = [];

for (let i = 1; i < rows2.length; i++) {
  const r = rows2[i];
  if (!r[0] && !r[1] && !r[2] && !r[3]) continue;
  tab2Data.push({
    rowIndex: i + 1,
    plo: (r[0] || '').trim(),
    k: (r[1] || '').trim(),
    s: (r[2] || '').trim(),
    a: (r[3] || '').trim()
  });
}

// 3. Sheet 1467183359 (Tab 3: KSA 66)
const csv3 = fs.readFileSync('sheet_live_gid_1467183359.csv', 'utf-8');
const rows3 = parseCSV(csv3);
const tab3Data = [];

if (rows3.length > 2) {
  const kLines = (rows3[2][0] || '').split(/\r?\n/).map(s => s.trim()).filter(Boolean);
  const sLines = (rows3[2][1] || '').split(/\r?\n/).map(s => s.trim()).filter(Boolean);
  const aLines = (rows3[2][2] || '').split(/\r?\n/).map(s => s.trim()).filter(Boolean);

  const maxLen = Math.max(kLines.length, sLines.length, aLines.length);
  for (let m = 0; m < maxLen; m++) {
    tab3Data.push({
      k: kLines[m] || '',
      s: sLines[m] || '',
      a: aLines[m] || ''
    });
  }
}

const liveData = {
  courses: courses,
  instructors: Array.from(instructors).sort(),
  tab2Data: tab2Data,
  tab3Data: tab3Data
};

console.log('Courses count from Google Sheet:', courses.length);
console.log('Instructors from Google Sheet:', liveData.instructors);
console.log('Tab 2 PLO rows count:', tab2Data.length);
console.log('Tab 3 KSA items count:', tab3Data.length);

// Read index.html and replace MOCK_DATA
let html = fs.readFileSync('index.html', 'utf-8');

const regex = /<script>\s*window\.MOCK_DATA\s*=\s*[\s\S]*?;\s*<\/script>/;
const newScript = `<script>\n  window.MOCK_DATA = ${JSON.stringify(liveData, null, 2)};\n</script>`;

if (regex.test(html)) {
  html = html.replace(regex, newScript);
} else {
  html = html.replace('</head>', `${newScript}\n</head>`);
}

fs.writeFileSync('index.html', html, 'utf-8');
fs.writeFileSync('local_preview.html', html, 'utf-8');
console.log('Successfully updated index.html and local_preview.html with 100% exact Google Sheet data!');
