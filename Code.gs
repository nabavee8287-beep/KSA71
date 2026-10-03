/**
 * ระบบกรอกข้อมูล (KSA) ปรับปรุงหลักสูตร
 * สาขาวิชาเทคโนโลยีดิจิทัลและสื่อสารการศึกษา หลักสูตรปรับปรุง 2571
 * คณะศึกษาศาสตร์ มหาวิทยาลัยสงขลานครินทร์
 * 
 * Google Spreadsheet ID: 1jsDG5NQJ7lc1SfOS2Hz0aXpBvCwcTQYYTc39H5SKmVA
 * Web App URL: https://script.google.com/macros/s/AKfycbyL1HnIyqbu8D8R4bD6AXYZNJM-wyNEBpOX0gG1gVXJY12ucjRD99-dS7mHK18KDQMlbQ/exec
 */

const SPREADSHEET_ID = "1jsDG5NQJ7lc1SfOS2Hz0aXpBvCwcTQYYTc39H5SKmVA";

const PLO_INFO = [
  { id: "PLO1", title: "PLO1: แสดงพฤติกรรมการมีจิตอาสา ทำงานเป็นทีมและทำงานร่วมกับชุมชนได้บรรลุเป้าหมาย" },
  { id: "PLO2", title: "PLO2: ปฏิบัติตนในฐานะพลเมืองดิจิทัลที่ใช้สื่อและเทคโนโลยีอย่างปลอดภัย" },
  { id: "PLO3", title: "PLO3: วิเคราะห์และออกแบบการจัดการเรียนรู้ในชั้นเรียนโดยใช้ศาสตร์การสอนและการวัดประเมินผลตาม จรรยาบรรณวิชาชีพครู" },
  { id: "PLO4", title: "PLO4: สร้างนวัตกรรมทางการศึกษาเพื่อปฏิบัติการสอนในชั้นเรียนโดยใช้เทคโนโลยีปัญญาประดิษฐ์ เทคโนโลยีดิจิทัลและวิจัยเป็นฐาน" },
  { id: "PLO5", title: "PLO5: พัฒนาสื่อดิจิทัลและแพลตฟอร์มเพื่อการศึกษาโดยใช้หลักการออกแบบที่ยึดผู้ใช้งานเป็นศูนย์กลาง" },
  { id: "PLO6", title: "PLO6: เลือกใช้และประเมินเทคโนโลยีปัญญาประดิษฐ์และเทคโนโลยีดิจิทัลเพื่อการตัดสินใจและแก้ปัญหา ขององค์กร" },
  { id: "PLO7", title: "PLO7: ปฏิบัติงานและจัดการเรียนรู้ในชั้นเรียนโดยใช้ศาสตร์ด้านเทคโนโลยีดิจิทัลและสื่อสารการศึกษา" }
];

/**
 * ให้บริการหน้าเว็บแอปพลิเคชัน และ REST API สำหรับภายนอก (เช่น Vercel)
 */
function doGet(e) {
  var action = e && e.parameter ? e.parameter.action : '';

  // 1. เรียกดูข้อมูลทั้งหมด (REST API GET)
  if (action === 'getData') {
    var data = getInitialData();
    return ContentService.createTextOutput(JSON.stringify(data))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // 2. รองรับการบันทึกผ่าน GET (Fallback สำหรับระบบที่บล็อก POST)
  if (action === 'saveKsa' && e.parameter.data) {
    try {
      var courseData = JSON.parse(e.parameter.data);
      var saveResult = saveCourseKSA(courseData);
      return ContentService.createTextOutput(JSON.stringify(saveResult))
        .setMimeType(ContentService.MimeType.JSON);
    } catch (err) {
      return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  if (action === 'deleteCourse' && e.parameter.rowIndex) {
    var delResult = deleteCourse(e.parameter.rowIndex);
    return ContentService.createTextOutput(JSON.stringify(delResult))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // 3. แสดงหน้าเว็บ (เมื่อเปิดบน Google Apps Script โดยตรง)
  var template;
  try {
    template = HtmlService.createTemplateFromFile('index');
  } catch (err) {
    template = HtmlService.createTemplateFromFile('Index');
  }
  return template.evaluate()
    .setTitle('ระบบกรอกข้อมูล KSA ปรับปรุงหลักสูตร 2571 - ม.อ.')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * รองรับ Web API POST สำหรับเรียกจากภายนอก เช่น Vercel
 * รองรับ Content-Type: text/plain, application/json, application/x-www-form-urlencoded
 */
function doPost(e) {
  try {
    var contents = (e && e.postData && e.postData.contents) ? e.postData.contents : '';
    var body = {};

    if (contents) {
      try {
        body = JSON.parse(contents);
      } catch (err) {
        body = (e && e.parameter) ? e.parameter : {};
      }
    } else if (e && e.parameter) {
      body = e.parameter;
    }

    var action = body.action || (e && e.parameter && e.parameter.action);
    var data = body.data || body;
    var rowIndex = body.rowIndex || (body.data && body.data.rowIndex) || (e && e.parameter && e.parameter.rowIndex);
    var result = { success: false, message: 'Unknown action: ' + action };

    if (action === 'saveKsa') {
      result = saveCourseKSA(data);
    } else if (action === 'addCourse') {
      result = addNewCourse(data);
    } else if (action === 'deleteCourse') {
      result = deleteCourse(rowIndex);
    } else if (action === 'getData') {
      result = getInitialData();
    }

    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * ดึง Spreadsheet ที่ใช้งาน
 */
function getSpreadsheet() {
  try {
    return SpreadsheetApp.openById(SPREADSHEET_ID);
  } catch (e) {
    return SpreadsheetApp.getActiveSpreadsheet();
  }
}

/**
 * ค้นหา Sheet ตามชื่อ หรือใช้ regex ช่วยค้นหาในกรณีที่มีเว้นวรรค
 */
function findSheet(ss, nameOrPattern) {
  var sheets = ss.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    var name = sheets[i].getName().trim();
    if (typeof nameOrPattern === 'string') {
      if (name === nameOrPattern.trim()) return sheets[i];
    } else if (nameOrPattern instanceof RegExp) {
      if (nameOrPattern.test(name)) return sheets[i];
    }
  }
  // Fallback: ตรวจสอบแบบ case-insensitive contains
  if (typeof nameOrPattern === 'string') {
    for (var j = 0; j < sheets.length; j++) {
      if (sheets[j].getName().toLowerCase().indexOf(nameOrPattern.toLowerCase()) !== -1) {
        return sheets[j];
      }
    }
  }
  return null;
}

/**
 * ดึงข้อมูลทั้งหมดที่จำเป็นสำหรับหน้าเว็บแอปพลิเคชัน
 */
function getInitialData() {
  try {
    var ss = getSpreadsheet();
    var sheets = ss.getSheets();
    
    var sheet1 = null;
    var sheet2 = null;
    var sheet3 = null;

    for (var i = 0; i < sheets.length; i++) {
      var name = sheets[i].getName().trim();
      if (name === 'กรอกข้อมูล KSA' || /กรอกข้อมูล.*KSA/i.test(name)) {
        sheet1 = sheets[i];
      } else if (/ตาราง.*PLOs.*Knowledge/i.test(name) || name === 'ตาราง(PLOs)  กับ Knowledge/ Skill/ Attitude') {
        sheet2 = sheets[i];
      } else if (/KSA.*66/i.test(name) || name === 'KSA ปึ 66') {
        sheet3 = sheets[i];
      }
    }
    if (!sheet1 && sheets.length > 0) sheet1 = sheets[0];

    // 1. ชีตกรอกข้อมูล KSA
    var courses = [];
    var instructors = {};

    if (sheet1) {
      var data1 = sheet1.getDataRange().getValues();
      if (data1.length > 1) {
        for (var r = 1; r < data1.length; r++) {
          var row = data1[r];
          // ข้ามแถวที่ไม่มีข้อมูล
          if (!row[0] && !row[1] && !row[2]) continue;

          var instName = row[4] ? String(row[4]).trim() : '';
          if (instName) {
            instructors[instName] = true;
          }

          var codeVal = row[1] !== undefined ? String(row[1]).trim() : '';
          var category = 'หมวดวิชาเฉพาะ (เทคโนโลยีดิจิทัลและสื่อสารการศึกษา)';
          if (codeVal.indexOf('260-') === 0 || codeVal.indexOf('261-') === 0) {
            category = 'หมวดวิชาชีพครู';
          } else if (codeVal.indexOf('000-') === 0) {
            category = 'หมวดวิชาศึกษาทั่วไป';
          }

          courses.push({
            rowIndex: r + 1, // 1-indexed สำหรับ Apps Script
            order: row[0] !== undefined ? String(row[0]).trim() : String(r),
            code: codeVal,
            name: row[2] !== undefined ? String(row[2]).trim() : '',
            credit: row[3] !== undefined ? String(row[3]).trim() : '',
            instructor: instName,
            plos: row[5] !== undefined ? String(row[5]).trim() : '',
            cloTh: row[6] !== undefined ? String(row[6]).trim() : '',
            cloEn: row[7] !== undefined ? String(row[7]).trim() : '',
            k: row[8] !== undefined ? String(row[8]).trim() : '',
            s: row[9] !== undefined ? String(row[9]).trim() : '',
            a: row[10] !== undefined ? String(row[10]).trim() : '',
            category: category
          });
        }
      }
    }

    // 2. ชีตตาราง(PLOs) กับ Knowledge/ Skill/ Attitude (แถบที่ 2)
    var tab2Data = [];
    if (sheet2) {
      var data2 = sheet2.getDataRange().getValues();
      if (data2.length > 1) {
        for (var i = 1; i < data2.length; i++) {
          var r2 = data2[i];
          if (!r2[0] && !r2[1] && !r2[2] && !r2[3]) continue;
          tab2Data.push({
            rowIndex: i + 1,
            plo: r2[0] ? String(r2[0]).trim() : '',
            k: r2[1] ? String(r2[1]).trim() : '',
            s: r2[2] ? String(r2[2]).trim() : '',
            a: r2[3] ? String(r2[3]).trim() : ''
          });
        }
      }
    }

    // 3. ชีต KSA ปี 66 (แถบที่ 3)
    var tab3Data = [];
    if (sheet3) {
      var data3 = sheet3.getDataRange().getValues();
      var kLines = [];
      var sLines = [];
      var aLines = [];

      // แถวที่ 1 เป็นหัวตารางใหญ่ แถว 2 คือ Knowledge, Skill, Attitude ข้อมูลเริ่มแถว 3
      for (var j = 2; j < data3.length; j++) {
        var r3 = data3[j];
        if (r3[0]) {
          var itemsK = String(r3[0]).split(/\r?\n/).map(function(s){ return s.trim(); }).filter(Boolean);
          kLines = kLines.concat(itemsK);
        }
        if (r3[1]) {
          var itemsS = String(r3[1]).split(/\r?\n/).map(function(s){ return s.trim(); }).filter(Boolean);
          sLines = sLines.concat(itemsS);
        }
        if (r3[2]) {
          var itemsA = String(r3[2]).split(/\r?\n/).map(function(s){ return s.trim(); }).filter(Boolean);
          aLines = aLines.concat(itemsA);
        }
      }

      var maxItems = Math.max(kLines.length, sLines.length, aLines.length);
      for (var m = 0; m < maxItems; m++) {
        tab3Data.push({
          k: kLines[m] || '',
          s: sLines[m] || '',
          a: aLines[m] || ''
        });
      }
    }

    return {
      success: true,
      courses: courses,
      instructors: Object.keys(instructors).sort(),
      tab2Data: tab2Data,
      tab3Data: tab3Data
    };
  } catch (error) {
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * บันทึกข้อมูล KSA ของรายวิชา (แถบที่ 1)
 * พร้อมซิงค์เข้าชีตตาราง(PLOs) กับ Knowledge/ Skill/ Attitude (แถบที่ 2) แบบ 1 แถว 1 PLO (4 คอลัมน์)
 * และชีตภาคผนวก ค - รายวิชากับ KSA (แถบที่ 4)
 */
function saveCourseKSA(courseData) {
  try {
    var ss = getSpreadsheet();
    var sheet1 = findSheet(ss, 'กรอกข้อมูล KSA') || ss.getSheets()[0];
    
    var rowIndex = parseInt(courseData.rowIndex, 10);
    if (!rowIndex || rowIndex < 2) {
      throw new Error('ไม่พบลำดับแถวที่ถูกต้องสำหรับบันทึกข้อมูล (rowIndex: ' + courseData.rowIndex + ')');
    }

    // อัปเดตคอลัมน์ F (6) ถึง K (11)
    // F: PLOs, G: CLO (ไทย), H: CLO (Eng), I: K:Knowledge, J: S: Skill, K: A:Attitude
    sheet1.getRange(rowIndex, 6).setValue(courseData.plos || '');
    sheet1.getRange(rowIndex, 7).setValue(courseData.cloTh || '');
    sheet1.getRange(rowIndex, 8).setValue(courseData.cloEn || '');
    sheet1.getRange(rowIndex, 9).setValue(courseData.k || '');
    sheet1.getRange(rowIndex, 10).setValue(courseData.s || '');
    sheet1.getRange(rowIndex, 11).setValue(courseData.a || '');

    // หากมีการระบุอาจารย์ผู้สอน อัปเดตคอลัมน์ E (5)
    if (courseData.instructor) {
      sheet1.getRange(rowIndex, 5).setValue(courseData.instructor);
    }

    // ซิงค์เข้าสู่ชีต แถบที่ 2 แบบ 1 แถว 1 PLO (4 คอลัมน์: PLOs, K, S, A)
    syncTab2Sheet(ss);

    // ซิงค์เข้าสู่ชีต แถบที่ 4 (ภาคผนวก ค - รายวิชากับ KSA)
    syncTab4Sheet(ss);

    return {
      success: true,
      message: 'บันทึกข้อมูลและซิงค์เข้าตารางสรุปเรียบร้อยแล้ว'
    };
  } catch (error) {
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * สรุปและซิงค์ข้อมูลเข้าสู่ชีต แถบที่ 2 แบบ 1 แถว 1 PLO (4 คอลัมน์: PLOs, K, S, A)
 */
function syncTab2Sheet(ss) {
  try {
    var sheet1 = findSheet(ss, 'กรอกข้อมูล KSA') || ss.getSheets()[0];
    var data1 = sheet1.getDataRange().getValues();

    var sheet2 = findSheet(ss, /ตาราง.*PLOs.*Knowledge/i) || findSheet(ss, 'ตาราง(PLOs)  กับ Knowledge/ Skill/ Attitude');
    if (!sheet2) {
      sheet2 = ss.insertSheet('ตาราง(PLOs)  กับ Knowledge/ Skill/ Attitude');
    }

    // รวบรวม K, S, A ของแต่ละ PLO จากทุกรายวิชาในชีต 1
    var ploMap = {};
    for (var p = 1; p <= 7; p++) {
      var pId = "PLO" + p;
      ploMap[pId] = { k: [], s: [], a: [] };
    }

    for (var r = 1; r < data1.length; r++) {
      var row = data1[r];
      var code = row[1] ? String(row[1]).trim() : '';

      var kVal = row[8] ? String(row[8]).trim() : '';
      var sVal = row[9] ? String(row[9]).trim() : '';
      var aVal = row[10] ? String(row[10]).trim() : '';

      for (var p2 = 1; p2 <= 7; p2++) {
        var pId2 = "PLO" + p2;
        var kText = extractPloContent(kVal, pId2);
        var sText = extractPloContent(sVal, pId2);
        var aText = extractPloContent(aVal, pId2);

        if (kText) ploMap[pId2].k.push("[" + code + "] " + kText);
        if (sText) ploMap[pId2].s.push("[" + code + "] " + sText);
        if (aText) ploMap[pId2].a.push("[" + code + "] " + aText);
      }
    }

    // เขียนหัวตาราง 4 คอลัมน์: PLOs, K:Knowledge, S: Skill, A:Attitude
    sheet2.clearContents();
    var outputRows = [
      ['PLOs', 'K:Knowledge', 'S: Skill', 'A:Attitude']
    ];

    for (var p3 = 0; p3 < PLO_INFO.length; p3++) {
      var info = PLO_INFO[p3];
      var dataObj = ploMap[info.id];
      outputRows.push([
        info.title,
        dataObj.k.join('\n\n'),
        dataObj.s.join('\n\n'),
        dataObj.a.join('\n\n')
      ]);
    }

    sheet2.getRange(1, 1, outputRows.length, 4).setValues(outputRows);
    sheet2.getRange(1, 1, 1, 4).setFontWeight('bold').setBackground('#002b5c').setFontColor('#ffffff');
    sheet2.setFrozenRows(1);
    sheet2.getRange(2, 1, outputRows.length - 1, 4).setWrap(true);
    sheet2.autoResizeColumns(1, 4);
  } catch (err) {
    Logger.log("Error syncing tab 2: " + err);
  }
}

/**
 * ดึงเนื้อหาเฉพาะของ PLO ที่ระบุจากข้อความ
 */
function extractPloContent(fullText, ploId) {
  if (!fullText) return '';
  var regex = new RegExp(ploId + '\\s*:\\s*([\\s\\S]*?)(?=PLO[1-7]\\s*:|$)', 'i');
  var match = fullText.match(regex);
  if (match && match[1]) {
    return match[1].trim();
  }
  return '';
}

/**
 * สรุปและซิงค์ข้อมูลเข้าสู่ชีต แถบที่ 4: ภาคผนวก ค - รายวิชากับ KSA
 */
function syncTab4Sheet(ss) {
  try {
    var sheet1 = findSheet(ss, 'กรอกข้อมูล KSA') || ss.getSheets()[0];
    var data1 = sheet1.getDataRange().getValues();

    var sheet4 = findSheet(ss, /ภาคผนวก.*ค/i) || findSheet(ss, /รายวิชากับ.*KSA/i) || findSheet(ss, 'ภาคผนวก ค - รายวิชากับ KSA');
    if (!sheet4) {
      sheet4 = ss.insertSheet('ภาคผนวก ค - รายวิชากับ KSA');
    }

    sheet4.clearContents();

    // หัวตารางตามรูปภาพ ภาคผนวก ค
    var outputRows = [
      ['หมวดวิชา', 'รหัสวิชา', 'ชื่อวิชา', 'หน่วยกิต', 'PLO1', 'PLO2', 'PLO3', 'PLO4', 'PLO5', 'PLO6', 'PLO7', 'ความรู้ (Knowledge: K)ทักษะ (Skills: S) และคุณลักษณะ (Ability: A)']
    ];

    for (var r = 1; r < data1.length; r++) {
      var row = data1[r];
      if (!row[1] && !row[2]) continue;

      var code = row[1] ? String(row[1]).trim() : '';
      var name = row[2] ? String(row[2]).trim() : '';
      var credit = row[3] ? String(row[3]).trim() : '';
      var plos = row[5] ? String(row[5]).trim() : '';
      var kVal = row[8] ? String(row[8]).trim() : '';
      var sVal = row[9] ? String(row[9]).trim() : '';
      var aVal = row[10] ? String(row[10]).trim() : '';

      // หมวดวิชา
      var cat = 'หมวดวิชาเฉพาะ (เทคโนโลยีดิจิทัลและสื่อสารการศึกษา)';
      if (code.indexOf('260-') === 0 || code.indexOf('261-') === 0) {
        cat = 'หมวดวิชาชีพครู';
      } else if (code.indexOf('000-') === 0) {
        cat = 'หมวดวิชาศึกษาทั่วไป';
      }

      // ตรวจสอบเครื่องหมายถูก PLO1 - PLO7
      var ploChecks = [];
      for (var p = 1; p <= 7; p++) {
        var pId = 'PLO' + p;
        var hasP = false;
        if (plos.toUpperCase().indexOf(pId) !== -1) hasP = true;
        if (extractPloContent(kVal, pId) || extractPloContent(sVal, pId) || extractPloContent(aVal, pId)) hasP = true;
        ploChecks.push(hasP ? '✓' : '');
      }

      // รวมเนื้อหา K, S, A
      var ksaLines = [];
      var cleanK = kVal.replace(/PLO[1-7]\s*:\s*/gi, '').trim();
      var cleanS = sVal.replace(/PLO[1-7]\s*:\s*/gi, '').trim();
      var cleanA = aVal.replace(/PLO[1-7]\s*:\s*/gi, '').trim();

      if (cleanK) ksaLines.push(cleanK);
      if (cleanS) ksaLines.push(cleanS);
      if (cleanA) ksaLines.push(cleanA);

      outputRows.push([
        cat,
        code,
        name,
        credit,
        ploChecks[0],
        ploChecks[1],
        ploChecks[2],
        ploChecks[3],
        ploChecks[4],
        ploChecks[5],
        ploChecks[6],
        ksaLines.join('\n')
      ]);
    }

    if (outputRows.length > 0) {
      sheet4.getRange(1, 1, outputRows.length, outputRows[0].length).setValues(outputRows);
      
      // จัดรูปแบบหัวตาราง
      var headerRange = sheet4.getRange(1, 1, 1, outputRows[0].length);
      headerRange.setBackground('#f1f5f9');
      headerRange.setFontWeight('bold');
      headerRange.setFontColor('#0f172a');
      headerRange.setHorizontalAlignment('center');
      sheet4.setFrozenRows(1);
      sheet4.getRange(2, 1, outputRows.length - 1, outputRows[0].length).setWrap(true);
    }
  } catch (err) {
    Logger.log('Error in syncTab4Sheet: ' + err.toString());
  }
}

/**
 * เพิ่มรายวิชาใหม่ในชีต 1 พร้อมซิงค์ตารางสรุป
 */
function addNewCourse(newCourse) {
  try {
    var ss = getSpreadsheet();
    var sheet1 = findSheet(ss, 'กรอกข้อมูล KSA') || ss.getSheets()[0];
    
    var lastRow = sheet1.getLastRow();
    var newOrder = lastRow; // ลำดับอัตโนมัติ

    sheet1.appendRow([
      newCourse.order || newOrder,
      newCourse.code || '',
      newCourse.name || '',
      newCourse.credit || '',
      newCourse.instructor || '',
      newCourse.plos || '',
      newCourse.cloTh || '',
      newCourse.cloEn || '',
      newCourse.k || '',
      newCourse.s || '',
      newCourse.a || ''
    ]);

    // ซิงค์ตารางแถบ 2 และ 4
    syncTab2Sheet(ss);
    syncTab4Sheet(ss);

    return {
      success: true,
      message: 'เพิ่มรายวิชาและซิงค์ตารางเรียบร้อยแล้ว'
    };
  } catch (error) {
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * ลบรายวิชาในชีต 1 พร้อมซิงค์ตารางสรุป
 */
function deleteCourse(rowIndex) {
  try {
    var ss = getSpreadsheet();
    var sheet1 = findSheet(ss, 'กรอกข้อมูล KSA') || ss.getSheets()[0];
    
    var r = parseInt(rowIndex, 10);
    if (!r || r < 2) {
      throw new Error('ไม่พบลำดับแถวที่ต้องการลบ (rowIndex: ' + rowIndex + ')');
    }

    sheet1.deleteRow(r);

    // ซิงค์ตารางแถบ 2 และ 4
    syncTab2Sheet(ss);
    syncTab4Sheet(ss);

    return {
      success: true,
      message: 'ลบรายวิชาและซิงค์ตารางเรียบร้อยแล้ว'
    };
  } catch (error) {
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * ฟังก์ชัน include สำหรับแยกไฟล์ HTML/CSS/JS ย่อยใน Apps Script (ถ้าต้องการ)
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
