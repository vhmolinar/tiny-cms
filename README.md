# Tiny CMS

A lightweight, headless Content Management System built with React, Vite, Tailwind CSS, and Firebase. 
This project is designed to act as a streamlined version of a larger enterprise CMS, focusing on a headless static publishing architecture.

## Architecture

- **Frontend (Admin UI):** React (via Vite) + Tailwind CSS v3.
- **Backend:** Firebase HTTP Cloud Functions (TypeScript).
- **Database:** Firestore (NoSQL).
- **Storage:** Firebase Storage for media and statically published JSON site data.
- **Authentication:** Firebase Auth (Email/Password).

## Prerequisites

- Node.js (v22+ recommended)
- Firebase CLI (`npm install -g firebase-tools`)

## Local Development Setup

This project uses **Firebase Local Emulators** for local development to avoid cloud costs and ensure a rapid, isolated development environment.

### 1. Start the Backend (Firebase Emulators)
Open a terminal and run the emulators. This will spin up local instances of Firestore, Storage, Auth, and Functions.

```bash
cd functions
npm install
npm run build
cd ..
firebase emulators:start
```

*The Emulator UI will be available at [http://127.0.0.1:4000](http://127.0.0.1:4000).*

### 2. Start the Frontend (Admin Dashboard)
Open a second terminal to run the Vite React app.

```bash
cd admin
npm install
npm run dev
```

*The Admin panel will be available at [http://localhost:5173](http://localhost:5173).*

### 3. Usage & Testing

1. Open the Emulator UI (`http://127.0.0.1:4000`) and navigate to the **Authentication** tab. Add a mock user (e.g., `admin@test.com` / `password`).
2. Go to the Admin panel (`http://localhost:5173`) and log in with the created credentials.
3. Click the **Publish Site** button on the dashboard.
4. Check the **Storage** tab in the Emulator UI. You will see a `site-data.json` file beautifully published to the local bucket.

## Deployment
*(To be configured - requires a real Firebase project ID and `firebase deploy`)*
