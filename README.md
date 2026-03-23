# 💻 TaskFlow Mini - ระบบหน้าบ้าน (Frontend Client)

แอปพลิเคชันรูปแบบใหม่ที่สร้างด้วย React 19 โดยใช้งานผ่านเครื่องมือ Vite พร้อมจัดสไตล์ Tailwind CSS อย่างลงตัว

## 🛠️ โครงสร้างเทคโนโลยี (Tech Stack)
- **React 19 + Vite:** สภาพแวดล้อมที่รวดเร็วสำหรับการสร้างหน้าต่างรับรองผู้ใช้งาน 
- **Tailwind CSS v4:** ใช้เขียนสไตล์เว็บแอป พร้อมตั้งค่าสำหรับการสลับดีไซน์โหมดมืด (Dark mode)
- **Zustand:** โปรแกรมจัดการ State กลางข้อมูลทั่วทั้งระบบในรูปแบบที่เบาและเข้าถึงง่าย
- **React Router DOM:** สำหรับการจัดการเส้นทาง URL การคลิกเชื่อมหน้าของ User
- **Recharts:** ระบบกราฟแสดงผลโต้ตอบ (Interactive) เพื่อใช้วิเคราะห์การทำงานของผู้ใช้งาน
- **gantt-task-react:** คอมโพเนนต์ที่ใช้เจาะจงสำหรับการวาดระบบมุมมองหน้า Timeframe (Gantt Chart)
- **shadcn/ui & Lucide React:** รวมไอคอนและรูปแบบ Component สำเร็จรูปสวยๆ ที่จัดการได้ง่าย

## 📝 การตั้งค่าตัวแปร (Environment Variables - `.env`)
คุณต้องทำการสร้างไฟล์ `.env` ไว้ในโฟลเดอร์ `client` โดยใช้ไฟล์ `.env.example` เป็นตัวต้นแบบ:

```env
# ตำแหน่ง URL แบบเจาะจงที่มีเป้าหมายเป็น NodeJS Backend API
VITE_API_URL=http://localhost:5000/api
```

## 🚀 การติดตั้งและเปิดทดสอบ (Installation & Running)

1. **เปิดไปที่ฝั่ง Frontend:** `cd client`
2. **ติดตั้งส่วนขยาย:** เนื่องจากไลบรารีของ Gantt chart มีเงื่อนไขการทำงานบางส่วนกับ React 19 แนะนำให้ใส่คีย์วอร์ดพ่วงตอนโหลด:
   ```bash
   npm install --legacy-peer-deps
   ```
3. **เปิดระบบประมวลผลเซิร์ฟเวอร์จำลอง (Dev Env):**
   ```bash
   npm run dev
   ```
*(ระบบพัฒนาโปรเจกต์จะเริ่มประมวลผลผ่านเว็บไซต์ `http://localhost:5173`)*

## 🏗️ สร้างระบบสำหรับการใช้งานจริง (Production Build)
```bash
npm run build
```
*(ถ้าต้องการตระเตรียมการนำไปจำลองลงบน Cloud Deploy Platform อย่าง Vercel หรือ Netlify คุณต้องแน่ใจว่าได้ระบุ Environment Variable เป็น (`VITE_API_URL`) บนแผงจัดการตัวแปรฝั่งเซิร์ฟเวอร์เว็บของเขาด้วย และถ้าเจอปัญหา Build Error อย่าลืมฝังไฟล์ตระกูล `.npmrc` เพื่อแก้ไขเรื่อง Version Conflicts ครับ)*
