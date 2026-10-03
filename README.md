# 🎓 ระบบกรอกข้อมูลและบริหารจัดการหลักสูตร (KSA) ปรับปรุงหลักสูตร 2571
### สาขาวิชาเทคโนโลยีดิจิทัลและสื่อสารการศึกษา คณะศึกษาศาสตร์ มหาวิทยาลัยสงขลานครินทร์ (ม.อ. ปัตตานี)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fnabavee8287-beep%2FKSA71)
![Platform](https://img.shields.io/badge/Platform-Google%20Apps%20Script%20%7C%20Vercel-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v3-38bdf8?logo=tailwindcss)
![Status](https://img.shields.io/badge/Status-Completed-success)

เว็บแอปพลิเคชันสำหรับการบริหารจัดการ กรอกข้อมูล และจัดทำรายงานผลลัพธ์การเรียนรู้ (Program Learning Outcomes: PLOs & Course Learning Outcomes: CLOs) พร้อมทั้งสมรรถนะด้านความรู้ (Knowledge: K), ทักษะ (Skill: S) และเจตคติ (Attitude: A) สำหรับการปรับปรุงหลักสูตร พ.ศ. 2571 สาขาวิชาเทคโนโลยีดิจิทัลและสื่อสารการศึกษา

---

## 🔗 แหล่งข้อมูลและลิงก์ของระบบ

* 🌐 **Web App URL หลัก (Google Apps Script)**: [https://script.google.com/macros/s/AKfycbyL1HnIyqbu8D8R4bD6AXYZNJM-wyNEBpOX0gG1gVXJY12ucjRD99-dS7mHK18KDQMlbQ/exec](https://script.google.com/macros/s/AKfycbyL1HnIyqbu8D8R4bD6AXYZNJM-wyNEBpOX0gG1gVXJY12ucjRD99-dS7mHK18KDQMlbQ/exec)
* 📊 **ฐานข้อมูลหลัก (Google Sheets)**: [Google Sheet ฐานข้อมูลหลักสูตร 2571 (ID: 1jsDG5NQJ7lc1SfOS2Hz0aXpBvCwcTQYYTc39H5SKmVA)](https://docs.google.com/spreadsheets/d/1jsDG5NQJ7lc1SfOS2Hz0aXpBvCwcTQYYTc39H5SKmVA/edit)
* 🐙 **GitHub Repository**: [https://github.com/nabavee8287-beep/KSA71](https://github.com/nabavee8287-beep/KSA71)

---

## ⚡ สรุปการแก้บัคและระบบการทำงานแบบ Real-time Sync

ระบบได้รับการปรับปรุงและแก้ไขบัคสำคัญ เพื่อให้ข้อมูลซิงค์กันทันทีเมื่อมีการกรอกข้อมูล:

1. **เชื่อมต่อ Web App URL เริ่มต้นอัตโนมัติ (Default Connected Mode)**:
   * หน้าเว็บแอปพลิเคชัน (ทั้งบน Vercel และ Local) ผูกค่าเริ่มต้นไปยัง `https://script.google.com/macros/s/AKfycbyL1HnIyqbu8D8R4bD6AXYZNJM-wyNEBpOX0gG1gVXJY12ucjRD99-dS7mHK18KDQMlbQ/exec` อัตโนมัติ โดยผู้ใช้ไม่จำเป็นต้องตั้งค่าเอง
2. **การดึงข้อมูลสดสองชั้น (Resilient Live Data Fetching)**:
   * **ชั้นที่ 1**: เรียกดูข้อมูลผ่าน Web App API (`?action=getData`)
   * **ชั้นที่ 2 (Direct Sheet Live Fallback)**: หาก Web App อยู่ระหว่างอัปเดตเวอร์ชัน ระบบจะดึงข้อมูลสด 100% จาก Google Sheet CSV Export โดยตรง (รองรับ CORS ปลอดภัย) ทำให้หน้าเว็บไม่ค้างและแสดงข้อมูลจริงเสมอ
3. **การส่งบันทึกข้อมูล (POST / CORS Safe Delivery)**:
   * แก้ไขปัญหา Browser บล็อก CORS OPTIONS Preflight โดยส่งข้อมูลด้วย `Content-Type: text/plain;charset=utf-8` พร้อมระบบ `no-cors fallback` ทำให้คำสั่งบันทึกส่งถึง `doPost` บน Apps Script เสมอ
4. **การซิงค์ตารางแบบทันที (Immediate Multi-tab Sync)**:
   * เมื่อกดบันทึกวิชาในแถบที่ 1 ระบบจะอัปเดตแถบที่ 2 (ตารางสรุป 7 PLOs) และแถบที่ 4 (ภาคผนวก ค) บนหน้าจอทันที
   * บน Google Sheet: ฟังก์ชัน `saveCourseKSA`, `addNewCourse` และ `deleteCourse` จะสั่งรัน `syncTab2Sheet` และ `syncTab4Sheet` ทันที ทำให้ตารางในชีตซิงค์ตรงกันเสมอ

---

## 🌟 คุณสมบัติและฟังก์ชันการทำงานของระบบ (4 แถบหลัก)

### 📌 แถบที่ 1: กรอกข้อมูล KSA ของแต่ละรายวิชา
* **ค้นหาและคัดกรอง**: กรองตามรายชื่ออาจารย์ผู้สอน หรือค้นหารหัสวิชา/ชื่อวิชาได้แบบ Real-time
* **หน้าต่างบันทึกข้อมูล (Popup Modal)**:
  * แสดงข้อมูล **PLO ทั้ง 7 ข้อ (PLO1 - PLO7)** พร้อมคำอธิบายสมรรถนะ
  * เมื่อติ๊กเลือก PLO ใด:
    * มีช่องให้กรอก **Knowledge (K)**: ไม่เกิน 5 ข้อ
    * มีช่องให้กรอก **Skill (S)**: ไม่เกิน 5 ข้อ
    * มีช่องให้กรอก **Attitude (A)**: ไม่เกิน 5 ข้อ
  * **คอลัมน์ G**: กรอกผลลัพธ์การเรียนรู้ระดับรายวิชาเป็นภาษาไทย (CLO Thai)
  * **คอลัมน์ H**: กรอกผลลัพธ์การเรียนรู้ระดับรายวิชาเป็นภาษาอังกฤษ (CLO English)
  * เมื่อกดบันทึก ข้อมูลจะถูกจัดรูปแบบอัตโนมัติ เช่น `PLO1: 1. ข้อแรก, 2. ข้อสอง...` บันทึกลงในคอลัมน์ I, J, K ของชีต และซิงค์เข้าแถบ 2 และ 4 ทันที
* **การจัดการรายวิชา**: มีปุ่มเพิ่มรายวิชาใหม่ และปุ่มลบรายวิชา

---

### 📊 แถบที่ 2: ตาราง (PLOs) กับ Knowledge/Skill/Attitude ปี 71
* **โครงสร้างตาราง 7 แถว**:
  * คอลัมน์แรกแสดงเฉพาะ **PLO1 ถึง PLO7** (1 แถวต่อ 1 PLO รวม 7 แถว)
  * คอลัมน์ถัดไปแสดงข้อมูล **Knowledge (K)**, **Skill (S)**, และ **Attitude (A)** ทั้งหมดที่อยู่ภายใต้ PLO นั้นๆ จากทุกรายวิชาที่อาจารย์กรอก
  * ข้อมูลถูกจัดเรียงเป็นข้อ ๆ มีรหัสวิชากำกับอย่างเป็นระเบียบ
* **ส่งออกข้อมูลได้ 3 รูปแบบ**:
  * 📄 **Export Word (.doc)**: รองรับการเปิดด้วย Microsoft Word พร้อมหัวเอกสารราชการและตารางจัดรูปแบบสวยงาม
  * 📑 **Export PDF / พิมพ์**: จัดหน้าพิมพ์แบบแนวนอน (Landscape) อัตโนมัติ
  * 📊 **Export CSV**: สำหรับนำไปเปิดและประมวลผลต่อใน Excel / Google Sheets

---

### 📖 แถบที่ 3: ข้อมูล KSA ของปี 66 (อ้างอิง)
* แสดงฐานข้อมูลสมรรถนะเดิมของหลักสูตรปี 2566 รวมกว่า 94 ข้อ
* แบ่งตารางออกเป็น 3 ด้าน: **ความรู้ (Knowledge)**, **ทักษะ (Skill)**, และ **เจตคติ (Attitude)**
* มีระบบค้นหาคำสำคัญ และปุ่มคลิกคัดลอก (Copy) ข้อความไปใช้งานได้ทันที

---

### 📑 แถบที่ 4: รายวิชากับ Knowledge/ Attitude/ Skill (ภาคผนวก ค)
* ตารางตามแบบฟอร์มเอกสารหลักสูตร **ภาคผนวก ค**
* จัดกลุ่มรายวิชาตามหมวดหมู่อัตโนมัติ (เช่น **หมวดวิชาชีพครู**, **หมวดวิชาเฉพาะด้าน**)
* แมปปิ้งเครื่องหมายถูก (`✓`) กับ **PLO1 - PLO7**
* รวมข้อความ Knowledge, Skill, Attitude ของแต่ละรายวิชา
* **ส่งออกข้อมูลได้ 3 รูปแบบ**: Word (.doc), PDF / พิมพ์, และ CSV

---

## 🛠️ ขั้นตอนสำคัญ: การอัปเดตเวอร์ชันบน Google Apps Script

เพื่อให้ Web App URL เดิม (`.../exec`) เรียกใช้งานฟังก์ชัน `doPost` และ `syncTab2Sheet` / `syncTab4Sheet` ล่าสุด:

1. เปิดสเปรดชีต: [Google Sheet ฐานข้อมูล KSA 71](https://docs.google.com/spreadsheets/d/1jsDG5NQJ7lc1SfOS2Hz0aXpBvCwcTQYYTc39H5SKmVA/edit)
2. ไปที่เมนู **ส่วนขยาย (Extensions)** > **Apps Script**
3. คัดลอกโค้ดจากโปรเจกต์ `Code.gs` ไปวางแทนที่ในไฟล์ `Code.gs` ทั้งหมด
4. กดปุ่ม **บันทึก (รูปแผ่นดิสก์)**
5. ไปที่มุมขวาบน กดปุ่ม **การทำให้ใช้งานได้ (Deploy)** > **จัดการการทำให้ใช้งานได้ (Manage deployments)**
6. คลิกไอคอน **ดินสอ (แก้ไข / Edit)** ที่รายการ Web App ที่ใช้งานอยู่
7. ที่ช่อง **เวอร์ชัน (Version)** เลือก **"เวอร์ชันใหม่" (New version)**
8. คลิก **ทำให้ใช้งานได้ (Deploy)**

---

## ⚡ การ Deploy และใช้งานบน Vercel

โปรเจกต์นี้ได้รับการตั้งค่า `vercel.json` ให้พร้อม Deploy บน **Vercel** แบบอัตโนมัติ:

1. เข้าไปที่ [Vercel Dashboard](https://vercel.com/new)
2. เข้าสู่ระบบด้วยบัญชี GitHub และคลิก **Import** ที่ `nabavee8287-beep/KSA71`
3. การตั้งค่า:
   * **Framework Preset**: `Other`
   * **Root Directory**: `./`
4. คลิกปุ่ม **Deploy**
5. เว็บไซต์จะออนไลน์พร้อมใช้งานทันที และเชื่อมต่อกับ Google Sheet โดยอัตโนมัติ

---

## 📁 โครงสร้างไฟล์ในโปรเจกต์ (Repository Structure)

```text
├── index.html            # โค้ดหน้าเว็บแอปพลิเคชันหลัก (Frontend UI ทั้ง 4 แถบ + Realtime Sync)
├── Code.gs               # สคริปต์ Backend (Apps Script + REST API doGet/doPost + Multi-sheet Sync)
├── local_preview.html    # หน้าพรีวิวแบบออฟไลน์
├── vercel.json           # การตั้งค่า Routing, Clean URLs และ Headers สำหรับ Vercel
├── package.json          # ข้อมูลโปรเจกต์
├── README.md             # เอกสารแนะนำและคู่มือการใช้งานระบบ
└── sheet_live_gid_*.csv  # ข้อมูลจริงจาก Google Sheet แต่ละหน้า
```

---

## 👨‍💻 ผู้พัฒนาและประสานงาน
* **สาขาวิชาเทคโนโลยีดิจิทัลและสื่อสารการศึกษา**
* คณะศึกษาศาสตร์ มหาวิทยาลัยสงขลานครินทร์ วิทยาเขตปัตตานี