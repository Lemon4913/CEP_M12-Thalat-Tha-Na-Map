# Project Structure

Recommended layout for the three phases of this project: frontend, backend, and post-process analytics.

```
CEP_M12-Thalat-Tha-Na-Map/
├── frontend/                   # TypeScript client, responsive for desktop/phone/tablet
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── styles/
│   │   └── api/                # calls into backend/api
│   ├── public/
│   ├── package.json
│   └── tsconfig.json
│
├── backend/                    # Python (FastAPI) server
│   ├── app/
│   │   ├── api/                # route handlers
│   │   ├── models/              # DB schema / ORM models
│   │   ├── services/            # business logic (e.g. encryption)
│   │   ├── crypto/               # encryption/decryption utilities
│   │   └── main.py
│   ├── tests/
│   ├── requirements.txt
│   └── .env.example
│
├── analytics/                  # Python post-processing & reporting
│   ├── notebooks/               # exploratory analysis (Jupyter)
│   ├── scripts/                 # scheduled/batch processing scripts
│   ├── reports/                 # generated charts/summaries (gitignored if large)
│   └── requirements.txt
│
├── docs/                       # design notes, data schema, diagrams
│
├── .gitignore
├── README.md
└── README.th.md
```

## Notes

- **frontend/** and **backend/** are separate deployable units — the frontend calls the backend over HTTP(S), so they can be developed and deployed independently.
- **backend/app/crypto/** isolates encryption logic so key handling stays in one auditable place, not scattered across route handlers.
- **analytics/** reads from the backend's database (or exported data), not the other way around — it should never need write access to production data.
- Each of `frontend/`, `backend/`, `analytics/` keeps its own dependency file (`package.json`, `requirements.txt`) so the three parts don't share a dependency tree.
- Real collected data, `.env` files, and generated reports should never be committed — cover them in `.gitignore`.
