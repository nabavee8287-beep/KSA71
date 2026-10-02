const fs = require('fs');

// Read sheet_export.csv, sheet_tab3.csv, sheet_tab2.csv
const sheet1Csv = fs.readFileSync('sheet_export.csv', 'utf-8');
const sheet3Csv = fs.readFileSync('sheet_tab3.csv', 'utf-8');

// Parse sheet 1
const lines1 = sheet1Csv.split(/\r?\n/).filter(Boolean);
const courses = [];
const instructors = new Set();

for (let i = 1; i < lines1.length; i++) {
  const cols = lines1[i].split(',');
  if (cols.length >= 3) {
    const inst = (cols[4] || '').trim();
    if (inst) instructors.add(inst);
    courses.push({
      rowIndex: i + 1,
      order: cols[0] || String(i),
      code: cols[1] || '',
      name: cols[2] || '',
      credit: cols[3] || '',
      instructor: inst,
      plos: cols[5] || '',
      cloTh: cols[6] || '',
      cloEn: cols[7] || '',
      k: cols[8] || '',
      s: cols[9] || '',
      a: cols[10] || ''
    });
  }
}

// Sample realistic KSA for courses
if (courses.length > 0) {
  courses[0].plos = "PLO1";
  courses[0].cloTh = "สามารถอธิบายหลักการถ่ายภาพดิจิทัลและนำไปประยุกต์ใช้เพื่อการศึกษาได้";
  courses[0].cloEn = "Able to explain digital photography principles and apply them to education.";
  courses[0].k = "PLO1: 1. อธิบายทฤษฎีเทคโนโลยีได้, 2. บอกองค์ประกอบของเทคโนโลยี";
  courses[0].s = "PLO1: 1. ทำงานร่วมกับชุมชน, 2. สื่อสารในทีมได้";
  courses[0].a = "PLO1: 1. มีจิตสาธารณะ, 2. มีความรับผิดชอบ";
}
if (courses.length > 1) {
  courses[1].plos = "PLO1, PLO2";
  courses[1].cloTh = "สามารถออกแบบและพัฒนาสื่อการเรียนรู้ดิจิทัลได้อย่างปลอดภัยและสร้างสรรค์";
  courses[1].cloEn = "Able to design and develop digital learning media safely and creatively.";
  courses[1].k = "PLO1: 1. เข้าใจหลักการออกแบบสื่อสารการศึกษา\nPLO2: 1. อธิบายกฎหมายและจริยธรรมดิจิทัล, 2. ตระหนักถึงความปลอดภัยทางไซเบอร์";
  courses[1].s = "PLO1: 1. ร่วมมือกับผู้อื่นในการผลิตสื่อ\nPLO2: 1. ป้องกันภัยคุกคามทางไซเบอร์ในสถานศึกษา, 2. ปกป้องข้อมูลส่วนบุคคล";
  courses[1].a = "PLO1: 1. รับฟังความคิดเห็นของผู้ร่วมงาน\nPLO2: 1. มีวินัยและความซื่อสัตย์ในการใช้สารสนเทศ";
}
if (courses.length > 2) {
  courses[2].plos = "PLO4";
  courses[2].cloTh = "สามารถสร้างนวัตกรรมทางการศึกษาโดยประยุกต์ใช้ Generative AI ในชั้นเรียนได้";
  courses[2].cloEn = "Able to create educational innovations using Generative AI in the classroom.";
  courses[2].k = "PLO4: 1. อธิบายหลักการทำงานของ AI ทางการศึกษา, 2. รู้วิธีการเขียน Prompt สำหรับการจัดการเรียนรู้";
  courses[2].s = "PLO4: 1. พัฒนานวัตกรรมการสอนด้วย Generative AI, 2. วิจัยในชั้นเรียนเพื่อพัฒนานวัตกรรม";
  courses[2].a = "PLO4: 1. มีความคิดริเริ่มสร้างสรรค์, 2. มุ่งมั่นพัฒนาการจัดการเรียนรู้";
}

// Add sample courses from the user's screenshot (หมวดวิชาชีพครู)
const sampleTeacherCourses = [
  {
    rowIndex: 101,
    order: '01',
    code: '260-302',
    name: 'กฎหมายและการประกันคุณภาพ',
    credit: '2((2)-0-4)',
    instructor: 'อาจารย์ผู้สอนหมวดวิชาชีพครู',
    plos: 'PLO1',
    cloTh: 'มีความรู้ความเข้าใจเกี่ยวกับกฎหมายการศึกษาและระบบประกันคุณภาพ',
    cloEn: 'Understand educational laws and quality assurance systems.',
    k: 'K28 K29 K30',
    s: 'S02 S15 S16 S17 S20 S22',
    a: 'A05 A06 A07 A08'
  },
  {
    rowIndex: 102,
    order: '02',
    code: '261-101',
    name: 'วิชาชีพและความเป็นครู',
    credit: '2((1)-2-3)',
    instructor: 'อาจารย์ผู้สอนหมวดวิชาชีพครู',
    plos: 'PLO1, PLO2',
    cloTh: 'เข้าใจปรัชญาการศึกษา จรรยาบรรณ และความเป็นครูมืออาชีพ',
    cloEn: 'Understand educational philosophy, ethics, and professional teaching.',
    k: 'K01 K02 K03 K05 K06 K07 K08 K09 K16',
    s: 'S01 S10 S11 S12 S13 S14 S15 S16 S17 S18 S19',
    a: 'A01 A02 A03 A04 A05 A06 A07 A08 A10 A11 A12 A13 A14'
  },
  {
    rowIndex: 103,
    order: '03',
    code: '261-201',
    name: 'ภาษาเพื่อการสื่อสารสำหรับครู',
    credit: '3((2)-2-5)',
    instructor: 'อาจารย์ผู้สอนหมวดวิชาชีพครู',
    plos: 'PLO2, PLO5',
    cloTh: 'สื่อสารภาษาไทยและภาษาอังกฤษเพื่อการจัดการเรียนรู้ได้อย่างมีประสิทธิภาพ',
    cloEn: 'Communicate in Thai and English for effective learning management.',
    k: 'A04 K07 K08 K09 K21 K26 K27 K33',
    s: 'S05 S09 S10 S11 S13 S14 S15 S16 S19 S20 S22',
    a: 'A01 A04 A05 A06 A07 A08 A09 A10 A11 A12 A13 A14'
  },
  {
    rowIndex: 104,
    order: '04',
    code: '261-301',
    name: 'การพัฒนาหลักสูตร',
    credit: '3((2)-2-5)',
    instructor: 'อาจารย์ผู้สอนหมวดวิชาชีพครู',
    plos: 'PLO1, PLO2, PLO3, PLO5',
    cloTh: 'วิเคราะห์ ออกแบบ และพัฒนาหลักสูตรสถานศึกษาได้',
    cloEn: 'Analyze, design, and develop school curricula.',
    k: 'K04 K14 K15 K33',
    s: 'S14 S15 S16 S17 S19 S20 S22',
    a: 'A07 A08 A10 A11 A12 A13'
  },
  {
    rowIndex: 105,
    order: '05',
    code: '261-203',
    name: 'วิทยาการการจัดการเรียนรู้',
    credit: '2((1)-2-3)',
    instructor: 'อาจารย์ผู้สอนหมวดวิชาชีพครู',
    plos: 'PLO1, PLO2',
    cloTh: 'ประยุกต์ใช้ศาสตร์การสอนในการจัดการเรียนรู้ในชั้นเรียนได้',
    cloEn: 'Apply pedagogical science to classroom learning management.',
    k: 'K06 K08 K13 K16 K17 K18 K34',
    s: 'S01 S02 S03 S04 S05 S09 S11 S13 S14 S15 S16 S17',
    a: 'A01 A02 A03 A07 A08 A10 A11'
  }
];

// Combine into courses list
courses.unshift(...sampleTeacherCourses);

// Parse sheet 3 (multi-line csv)
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

const parsed3 = parseCSV(sheet3Csv);
const tab3Data = [];
// skip first 2 rows
for (let i = 2; i < parsed3.length; i++) {
  const r = parsed3[i];
  if (r && (r[0] || r[1] || r[2])) {
    tab3Data.push({
      k: (r[0] || '').trim(),
      s: (r[1] || '').trim(),
      a: (r[2] || '').trim()
    });
  }
}

const initialTab2 = [];
if (courses.length > 0 && courses[0].k) {
  initialTab2.push({
    plos: courses[0].plos,
    k: courses[0].k,
    s: courses[0].s,
    a: courses[0].a,
    savedBy: courses[0].instructor || 'อาจารย์ผู้รับผิดชอบรายวิชา',
    timestamp: new Date().toLocaleString('th-TH')
  });
}

const mockData = {
  courses: courses,
  instructors: Array.from(instructors).sort(),
  tab2Data: initialTab2,
  tab3Data: tab3Data
};

// Read Index.html and inject MOCK_DATA
let indexHtml = fs.readFileSync('Index.html', 'utf-8');
const injectScript = `
<script>
  window.MOCK_DATA = ${JSON.stringify(mockData, null, 2)};
</script>
`;

indexHtml = indexHtml.replace('</head>', `${injectScript}\n</head>`);
fs.writeFileSync('local_preview.html', indexHtml);
fs.writeFileSync('index.html', indexHtml);
console.log('local_preview.html and index.html generated successfully with', courses.length, 'courses and', tab3Data.length, 'KSA 66 records!');

