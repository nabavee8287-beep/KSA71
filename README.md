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
* 📊 **ฐานข้อมูลหลัก (Google Sheets)**: [Google Sheet ฐานข้อมูลหลักสูตร 2571 (ID: 1jsDG5NQJ7lc1SfOS2Hz0aXpBvCwcTQYYTc39H5SKmVA)](https://docs.google.com/spreadsheets/d/1jsDG5NQJ7lc1SfOS2Hz0aXpBvCwcTQYYTc39H5SKmVA/edit?gid=76073810#gid=76073810)
* 🐙 **GitHub Repository**: [https://github.com/nabavee8287-beep/KSA71](https://github.com/nabavee8287-beep/KSA71)

---

## ⚡ ระบบการทำงานแบบ Real-time Sync อัตโนมัติ (ไม่ต้องคอยรีเฟรช)

ระบบได้รับการปรับปรุงและเชื่อมต่อแบบสองทางสมบูรณ์แบบ:

1. **ระบบ Background Auto-Sync (Real-time Live Polling)**:
   * หน้าเว็บแอปพลิเคชันมีระบบตรวจจับการเปลี่ยนแปลงจาก Google Sheet ในเบื้องหลังทุก 8 วินาที และเมื่อสลับกลับมาที่หน้าต่างเบราว์เซอร์
   * เมื่ออาจารย์ท่านใดบันทึกข้อมูลในระบบ อาจารย์ท่านอื่น ๆ ที่เปิดหน้าเว็บอยู่จะเห็นข้อมูลอัปเดตตรงกันทันทีแบบ Real-time โดยไม่ต้องคอยกด F5 หรือรีเฟรชหน้าเว็บ
2. **ไม่ต้องแก้ไขหรืออัปเดต Code.gs ซ้ำอีก**:
   * โค้ดใน `Code.gs` ถูกเขียนให้รองรับ REST API ครบทุกรูปแบบทั้ง `doGet` และ `doPost` เมื่อ Deploy ครั้งแรกแล้ว **ไม่จำเป็นต้องแก้ไขหรืออัปเดตใน Code.gs อีกต่อไป** ระบบจะเชื่อมต่อและซิงค์ข้อมูลกับ Google Sheet ได้ตลอดไป
3. **การซิงค์ตารางหลายชีตทันที (Multi-sheet Immediate Sync)**:
   * เมื่อกดบันทึกวิชาในแถบที่ 1 ระบบจะคำนวณและอัปเดตแถบที่ 2 (ตารางสรุป 7 PLOs) และแถบที่ 4 บนหน้าจอทันที
   * บน Google Sheet: ฟังก์ชัน `saveCourseKSA`, `addNewCourse` และ `deleteCourse` จะสั่งรัน `syncTab2Sheet` และ `syncTab4Sheet` ทันที

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
  * เมื่อกดบันทึก ข้อมูลจะถูกจัดรูปแบบอัตโนมัติ เช่น `PLO1: 1. ข้อแรก, 2. ข้อสอง...` บันทึกลงในชีต และซิงค์เข้าแถบ 2 และ 4 ทันที

---

### 📊 แถบที่ 2: ตาราง (PLOs) กับ KSA ปี 71
* **โครงสร้างตาราง 7 แถว**:
  * คอลัมน์แรกแสดงเฉพาะ **PLO1 ถึง PLO7** (1 แถวต่อ 1 PLO รวม 7 แถว)
  * คอลัมน์ถัดไปแสดงข้อมูล **Knowledge (K)**, **Skill (S)**, และ **Attitude (A)** ทั้งหมดที่อยู่ภายใต้ PLO นั้นๆ จากทุกรายวิชาที่อาจารย์กรอก
  * ข้อมูลถูกจัดเรียงเป็นข้อ ๆ มีรหัสวิชากำกับอย่างเป็นระเบียบ
* **ส่งออกข้อมูลได้ 3 รูปแบบ**: Word (.doc), PDF / พิมพ์, และ CSV

---

### 📖 แถบที่ 3: KSA ปี 66
* แสดงฐานข้อมูลสมรรถนะเดิมของหลักสูตรปี 2566 รวมกว่า 94 ข้อ
* **จัดแสดง 3 คอลัมน์อย่างเป็นระเบียบสวยงาม**:
  * **🧠 KNOWLEDGE (ความรู้)**: รหัส K01..K28...
  * **🛠️ SKILL (ทักษะ)**: รหัส S01..S26... พร้อมปุ่มคัดลอก
  * **❤️ ATTITUDE (เจตคติ)**: รหัส A01..A17...
* มีระบบค้นหาคำสำคัญแบบ Real-time และปุ่มคลิกคัดลอก (Copy) ข้อความไปใช้งานได้ทันที

---

### 📑 แถบที่ 4: รายวิชากับ PLOs และ KSA ปี 71
* ตารางตามแบบฟอร์มเอกสารหลักสูตร **ภาคผนวก ค** (ปรับตารางสะอาดตา นำช่องที่มี `-` ออกเรียบร้อยแล้ว)
* **เพิ่มช่องเลือกอาจารย์ผู้สอน (ดูเฉพาะของตัวเอง หรือดูทุกคน)**:
  * อาจารย์สามารถคลิกดรอปดาวน์เพื่อเลือกดูเฉพาะรายวิชาที่ตนเองรับผิดชอบ หรือเลือกดูทั้งหมดได้ทันที
  * สามารถกรองควบคู่กับ "ทุก PLO" ได้
* แมปปิ้งเครื่องหมายถูก (`✓`) กับ **PLO1 - PLO7**
* รวมข้อความ Knowledge, Skill, Attitude ของแต่ละรายวิชา
* **ส่งออกข้อมูลได้ 3 รูปแบบ**: Word (.doc), PDF / พิมพ์, และ CSV

---

## 🛠️ ขั้นตอนสำหรับการ Deploy บน Google Apps Script (ทำเพียงครั้งเดียว)

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
├── README.md             # เอกสารแนะนำและคู่มือการใช้งานระบบ
└── sheet_live_gid_*.csv  # ข้อมูลจริงจาก Google Sheet แต่ละหน้า
```

---

## 👨‍💻 ผู้พัฒนาและประสานงาน
* **สาขาวิชาเทคโนโลยีดิจิทัลและสื่อสารการศึกษา**
* คณะศึกษาศาสตร์ มหาวิทยาลัยสงขลานครินทร์ วิทยาเขตปัตตานี