# Smart Contract Builder for Freelancers

A full-stack starter for a freelancer-focused contract platform with custom FastAPI JWT auth and a routed React dashboard UI.

## Stack

- Frontend: React, Vite, TypeScript, React Router
- Backend: FastAPI, SQLAlchemy, SQLite
- Auth: JWT with Python-JOSE
- Password hashing: Passlib + bcrypt

## Project Structure

```text
smart-contract-builder/
├─ backend/
│  ├─ app/
│  │  ├─ database.py
│  │  ├─ dependencies.py
│  │  ├─ main.py
│  │  ├─ models.py
│  │  ├─ schemas.py
│  │  ├─ security.py
│  │  └─ routers/
│  │     └─ auth.py
│  ├─ .env.example
│  └─ requirements.txt
└─ frontend/
   ├─ src/
   │  ├─ app/layout/
   │  ├─ components/
   │  ├─ context/
   │  ├─ lib/
   │  ├─ pages/
   │  ├─ App.tsx
   │  ├─ index.css
   │  └─ main.tsx
   ├─ .env.example
   └─ package.json
```

## Backend Setup

Create `backend/.env` from `backend/.env.example`:

```env
SECRET_KEY=CHANGE_THIS_TO_A_LONG_RANDOM_SECRET
```

Install and run:

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Frontend Setup

Create `frontend/.env` from `frontend/.env.example`:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Install and run:

```bash
cd frontend
npm install
npm run dev
```

## Included Now

- Email/password signup and login
- JWT-based session persistence
- Protected frontend routes
- Sidebar/topbar SaaS shell
- Dashboard, create contract, contracts, risk, and profile screens

## Next Build Phase

- Connect the contract creation UI to real backend contract data
- Save contract drafts in the database
- Add real risk scoring logic
- Add PDF export
- Add external auth providers later if needed
