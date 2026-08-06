# โครงสร้างโปรเจกต์

*[Read in English](PROJECT_STRUCTURE.md)*

โครงสร้างที่แนะนำสำหรับสามส่วนของโปรเจกต์นี้ ได้แก่ frontend, backend และการวิเคราะห์ข้อมูลภายหลัง (post-process analytics)

```
CEP_M12-Thalat-Tha-Na-Map/
├── frontend/                   # ไคลเอนต์ TypeScript รองรับทั้งเดสก์ท็อป/มือถือ/แท็บเล็ต
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── styles/
│   │   ├── data/                # ข้อมูล static/sample (เช่น POI JSON สำรอง)
│   │   ├── lib/                 # ฟังก์ชันช่วยฝั่งไคลเอนต์ (เช่น visitor ID)
│   │   └── api/                # เรียกไปยัง backend/api
│   ├── public/
│   ├── package.json
│   └── tsconfig.json
│
├── backend/                    # เซิร์ฟเวอร์ Python (FastAPI)
│   ├── app/
│   │   ├── api/                # route handlers
│   │   ├── models/              # DB schema / ORM models
│   │   ├── services/            # ตรรกะทางธุรกิจ (เช่น การเข้ารหัส)
│   │   ├── crypto/               # เครื่องมือเข้ารหัส/ถอดรหัสข้อมูล
│   │   ├── db.py                # ตั้งค่า DB session/engine
│   │   ├── schemas.py           # Pydantic request/response models
│   │   └── main.py
│   ├── tests/
│   ├── requirements.txt
│   └── .env.example
│
├── analytics/                  # การประมวลผลและรายงานข้อมูลด้วย Python
│   ├── notebooks/               # การวิเคราะห์ข้อมูลเชิงสำรวจ (Jupyter)
│   ├── scripts/                 # สคริปต์ประมวลผลแบบ scheduled/batch
│   ├── reports/                 # กราฟ/สรุปข้อมูลที่สร้างขึ้น (gitignore หากไฟล์ใหญ่)
│   └── requirements.txt
│
├── tools/                      # เครื่องมือแยกอิสระ (ไม่พึ่งพา backend)
│   └── qr-generator.html        # สร้าง QR/โลโก้สำหรับพิมพ์ติดจุด POI
│
├── docs/                       # บันทึกการออกแบบ, data schema, ไดอะแกรม
│
├── .gitignore
├── README.md
└── README.th.md
```

## หมายเหตุ

- **frontend/** และ **backend/** เป็นหน่วยที่ deploy แยกจากกัน — frontend เรียก backend ผ่าน HTTP(S) จึงสามารถพัฒนาและ deploy แยกอิสระจากกันได้
- **backend/app/crypto/** แยกตรรกะการเข้ารหัสไว้ต่างหาก เพื่อให้การจัดการคีย์อยู่ในที่เดียวที่ตรวจสอบได้ ไม่กระจัดกระจายอยู่ตาม route handlers
- **analytics/** อ่านข้อมูลจากฐานข้อมูลของ backend (หรือข้อมูลที่ export ออกมา) เท่านั้น ไม่ใช่ในทางกลับกัน — จึงไม่ควรมีสิทธิ์เขียนข้อมูล production เด็ดขาด
- ทั้ง `frontend/`, `backend/`, `analytics/` ต่างมีไฟล์ dependency ของตัวเอง (`package.json`, `requirements.txt`) เพื่อไม่ให้ทั้งสามส่วนใช้ dependency tree ร่วมกัน
- ข้อมูลจริงที่เก็บรวบรวมมา, ไฟล์ `.env`, และรายงานที่สร้างขึ้น ห้าม commit เข้า repository เด็ดขาด — ให้ระบุไว้ใน `.gitignore`
