# 🚀 Campus Sentinel AI — Complete Production Deployment Guide

This guide contains step-by-step instructions for deploying the **Campus Sentinel / Agent Nexus** platform to **Vercel** (Frontend) and **Render** (Backend).

---

## SECTION 1: GitHub Repository

- **Repository URL:** `https://github.com/Nikhitha118/Agent_Nexus.git`
- **Deployment Branch:** `main`
- **Project Structure:**
  - `frontend/` — React 18 + Vite SPA with Leaflet digital twin mapping and Web Speech API.
  - `backend/` — Node.js + Express + Socket.IO real-time multi-agent emergency orchestrator.

---

## SECTION 2: Vercel Frontend Deployment

1. Log in to [Vercel](https://vercel.com/) and click **Add New Project**.
2. Select your GitHub repository: `Nikhitha118/Agent_Nexus`.
3. Configure the Project Settings:
   - **Framework Preset:** `Vite`
   - **Root Directory:** Click *Edit* and select `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm ci`
4. Add the Environment Variables (see Section 4 & 5 below for details).
5. Click **Deploy**.

> **Note on Routing:** `frontend/vercel.json` is pre-configured with SPA route rewrites (`/(.*) -> /index.html`), ensuring browser reloads and direct links resolve properly without 404 errors.

---

## SECTION 3: Render Backend Deployment

1. Log in to [Render](https://render.com/) and click **New +** → **Web Service**.
2. Connect your GitHub repository: `https://github.com/Nikhitha118/Agent_Nexus.git`.
3. Configure the Web Service settings:
   - **Name:** `campus-sentinel-backend` (or your preferred name)
   - **Region:** Choose the region closest to you (e.g., Singapore, Frankfurt, Oregon)
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm ci`
   - **Start Command:** `npm start`
   - **Instance Type:** `Free`
4. Expand **Advanced Settings**:
   - **Health Check Path:** `/health`
5. Add the Environment Variables (see Section 4 below).
6. Click **Create Web Service**.

---

## SECTION 4: Environment Variables Reference

Enter these variables in the respective hosting dashboards:

### 🅰️ Render (Backend Web Service Dashboard)
Under **Environment Variables**:

| Variable Name | Recommended Value / Purpose |
|---|---|
| `PORT` | `10000` (Render sets this automatically, but you can explicitly specify it) |
| `NODE_ENV` | `production` |
| `FRONTEND_URL` | `https://YOUR-VERCEL-APP.vercel.app` (Add after Vercel deployment) |
| `CLIENT_URL` | `https://YOUR-VERCEL-APP.vercel.app` |
| `AI_PROVIDER` | `LOCAL_SENTINEL_INFERENCE` |
| `AI_API_KEY` | *(Optional: your external AI key if using external cloud LLM)* |
| `MAP_API_KEY` | *(Optional: Google Maps API key for address geocoding)* |
| `MONGODB_URI` | *(Optional: MongoDB connection URI if enabling persistent database)* |

### 🅱️ Vercel (Frontend Project Settings Dashboard)
Under **Settings → Environment Variables**:

| Variable Name | Recommended Value / Purpose |
|---|---|
| `VITE_API_URL` | `https://YOUR-RENDER-BACKEND.onrender.com` |
| `VITE_SOCKET_URL` | `https://YOUR-RENDER-BACKEND.onrender.com` |
| `VITE_GOOGLE_MAPS_API_KEY` | *(Optional: your Google Maps key)* |
| `VITE_GOOGLE_MAPS_MAP_ID` | *(Optional: your Google Maps ID)* |
| `VITE_CAMPUS_LAT` | `16.233200` |
| `VITE_CAMPUS_LNG` | `80.549000` |
| `VITE_CAMPUS_NAME` | `Vignan's Foundation for Science, Technology & Research (VFSTR), Vadlamudi` |

---

## SECTION 5: Connecting Frontend and Backend

Follow this 2-step sequence to establish the connection:

### Step 1: Deploy Backend on Render First
1. Create and deploy the backend on Render.
2. Once deployed, Render will provide a public URL, for example:
   ```text
   https://campus-sentinel-backend.onrender.com
   ```
3. Test that the health endpoint works in your browser:
   `https://campus-sentinel-backend.onrender.com/health` (should return `{"status":"ok"}`).

### Step 2: Deploy Frontend on Vercel
1. Set the following variables in Vercel with your Render backend URL:
   - `VITE_API_URL` = `https://campus-sentinel-backend.onrender.com`
   - `VITE_SOCKET_URL` = `https://campus-sentinel-backend.onrender.com`
2. Trigger the deployment on Vercel.
3. Vercel will provide your frontend URL, for example:
   ```text
   https://agent-nexus.vercel.app
   ```

### Step 3: Update Render CORS with Vercel Domain
1. Go back to your Render Dashboard → **Environment**.
2. Update `FRONTEND_URL` and `CLIENT_URL` to your Vercel URL:
   - `FRONTEND_URL` = `https://agent-nexus.vercel.app`
   - `CLIENT_URL` = `https://agent-nexus.vercel.app`
3. Render will automatically redeploy with the updated CORS configuration.

---

## SECTION 6: File Uploads & In-Memory Storage Note

- **Image & Video Uploads**: Incident evidence and issue attachments (photos/videos) are handled via Base64 data URIs and transmitted in JSON payloads (`express.json({ limit: "50mb" })`).
- **Storage Lifecycle**: Reports, incidents, and audit logs are maintained in the backend server memory and `users.json`. On Render's Free tier, service restarts or spin-downs after inactivity will reset runtime state to the verified digital twin baseline. For a permanent production database, configure `MONGODB_URI`.

---

## SECTION 7: Final Post-Deployment Test Checklist

After completing the steps above, run through this verification checklist:

- [ ] **Health Check**: Open `https://YOUR-BACKEND.onrender.com/health` $\rightarrow$ returns `{"status":"ok"}`.
- [ ] **Frontend Loading**: Open `https://YOUR-FRONTEND.vercel.app` $\rightarrow$ Secure Access Portal loads cleanly.
- [ ] **Role Login**: Log in with Student (`student` / `student123`) or Admin (`admin` / `admin123`).
- [ ] **Live Map**: Open Live Satellite Map $\rightarrow$ Esri Satellite / OSM street tiles load, cyan VFSTR geofence polygon renders, and 15 building markers display coordinates and distances.
- [ ] **Emergency AI & Voice**: Open Emergency AI $\rightarrow$ verify speech recognition extracts Incident Type, Campus Block, Floor, and Room.
- [ ] **Real-Time WebSockets**: Trigger a simulation $\rightarrow$ verify emergency banner, hazard radius, evacuation route, and notifications update in real time.
