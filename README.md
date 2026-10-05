# Employee Management System 👥📊

A modern, responsive full-stack Employee Management System built with **React (Vite)** on the frontend and **Flask (SQLAlchemy)** on the backend.

---

## 🚀 Features

- **Admin Authentication**: Secure login interface (demo credentials: `admin` / `admin123`).
- **Dashboard Overview**: Key metrics including total employees, active count, and departments.
- **Visual Analytics**: Interactive department distribution bar chart powered by Recharts.
- **CRUD Operations**: Add, view, edit, and delete employee records with instant updates.
- **Search & Filter**: Search employees by name, email, or designation and filter by department.
- **Production-Ready**: Ready for cloud deployment on Vercel, Netlify, Render, and Railway.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Recharts, Modern CSS
- **Backend**: Python 3, Flask, Flask-SQLAlchemy, Flask-CORS, Gunicorn
- **Database**: SQLite (local) / PostgreSQL (production compatible via `DATABASE_URL`)

---

## 📂 Project Structure

```
employee-management-system/
├── backend/
│   ├── app.py              # Flask API routes & models
│   ├── requirements.txt    # Python dependencies
│   ├── Procfile            # Gunicorn process config for Render/Railway
│   └── employees.db        # SQLite database
├── frontend/
│   ├── src/
│   │   ├── App.jsx         # Main application component
│   │   ├── index.css       # Complete application styles
│   │   └── main.jsx        # App entry point
│   ├── package.json        # Frontend dependencies
│   ├── vercel.json         # SPA routing config for Vercel
│   └── vite.config.js      # Vite build config
├── Procfile                # Root process file
└── README.md
```

---

## 💻 Local Setup & Development

### 1. Backend Setup
```bash
cd backend
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

pip install -r requirements.txt
python app.py
```
Backend will run at `http://127.0.0.1:5000`.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend will run at `http://localhost:5173`.

---

## 🌐 Deployment Instructions

### Deploy Backend (e.g., Render)
1. Sign up on [Render.com](https://render.com) and create a **New Web Service**.
2. Connect your repository: `https://github.com/srustimohan4636-svg/employee-management-system`.
3. Set:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
4. Copy your backend service URL (e.g. `https://employee-api.onrender.com`).

### Deploy Frontend (e.g., Vercel)
1. Sign up on [Vercel.com](https://vercel.com) and click **Add New Project**.
2. Import `srustimohan4636-svg/employee-management-system`.
3. Set:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Vite`
4. In **Environment Variables**, add:
   - `VITE_API_URL` = `https://<your-backend-url>.onrender.com`
5. Click **Deploy**.