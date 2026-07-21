# Talat Tha Na Map

*[อ่านเป็นภาษาไทย](README.th.md)*

A digital map and QR-code "digital stamp" web app for **Talat Tha Na**, a 140-year-old riverside community market in Nakhon Chai Si, Nakhon Pathom, Thailand. Built as a Community Engagement Program (CEP) project by students of Mahidol Wittayanusorn School.

## Background

Talat Tha Na has existed since the reign of Rama I and grew into a major trading community by the reign of Rama V, taking its name from the pier ("ท่า") once used to trade rice. In recent years, visitor numbers have declined — a well-known local restaurant relocated, and the market lacks any wayfinding or information system, leaving visitors unaware of what each shop sells, with no guided route to points of interest, and unable to fully experience the community's hidden charm.

This project addresses that gap with a digital map of the market and a QR-code-based Walk-Rally activity, encouraging visitors to explore the market fully and creating sustainable commercial opportunities for local vendors.

## Objective

Develop a digital map system with a **Digital Stamp** collection feature, activated by scanning QR codes placed at points of interest around the market.

## Who it's for

- **Users:** tourists unfamiliar with Talat Tha Na
- **Beneficiaries:** local vendors and shop owners

## Expected Outcomes

1. Increased income distribution to community shops, by encouraging visitors to spend more time — and money — in the market.
2. A navigation and wayfinding system (market map, QR codes at key points, shop locations) so visitors can explore thoroughly without getting lost, which also serves as a tool for measuring visitor distribution across the market.
3. Promotion of historical and cultural tourism, by communicating the market's history, culture, and way of life to visitors.

The full project proposal (background, timeline, budget, evaluation plan) is in [CEP_ข้อเสนอโครงการ.md](CEP_ข้อเสนอโครงการ.md).

## Tech Stack

| Layer | Stack |
|---|---|
| Frontend | TypeScript + React (Vite) |
| Backend | Python + FastAPI, with encryption for collected data |
| Analytics | Python (pandas, matplotlib) for post-processing and reporting |

See [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) for the full repository layout and rationale.

## Getting Started

```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend
cd backend
pip install -r requirements.txt
cp .env.example .env   # fill in DATABASE_URL and ENCRYPTION_KEY
uvicorn app.main:app --reload

# Analytics
cd analytics
pip install -r requirements.txt
```

## Team

**Project lead:** นายณรงค์วัส วาจรัต

**Team members:**
- นางสาวปารณีย์ หอสุวรรณานนท์
- นายญาณวุฒิ นิลทรัตน์
- นางสาวชนัญชิดา บุญไชยโย
- นายธนภัทร เธียรจินดากุล
- นายศิลปะ ชัยบุรัมย์
- นายรัชชานนท์ ชานันโท
- นายกิตติพิชญ์ คุณรักษ์พงศ์

All from Mahidol Wittayanusorn School.

**Advisors:**
- นางสาวดวงแข ศรีคุณ — Chemistry Department, Mahidol Wittayanusorn School
- นางสาวเกล็ดทราย ภูผาคุณ — Physics Department, Mahidol Wittayanusorn School
- นายบุญฤทธิ์ พูนพนิช — Faculty of Fine and Applied Arts, Bunditpatanasilpa Institute
- นายนิชชาฌ ปัญจกาญน์มณี — Village Headman, Talat Tha Na Community

## Contributing

This is a school CEP project with a fixed team, but issues and suggestions are welcome. Please open an issue before submitting significant changes.
