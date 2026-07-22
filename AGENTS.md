# Tiny CMS - Agent Documentation

This file provides architectural context and guidelines for AI agents working on this repository.

## Project Scope
This project (`tiny-cms`) is a "Tiny" MVP version of a larger headless Laravel CMS. It migrates the core headless static-generation concept to a fully serverless Firebase stack. The primary goal is to prove the end-to-end publishing pipeline works simply and effectively before adding complex features like visual page builders.

## Architecture & Technology Stack

1. **Frontend (`/admin`)**: 
   - Framework: React bootstrapped with Vite (`react-ts` template).
   - Styling: Tailwind CSS v3 + CSS Modules. The UI must strictly follow premium, modern design aesthetics (glassmorphism, subtle micro-animations). Avoid generic looks.
   - Routing: `react-router-dom`.
   - Icons: `lucide-react`.

2. **Backend (`/functions`)**:
   - Framework: Firebase HTTP Cloud Functions written in TypeScript.
   - Purpose: Acts as the "Publishing Engine". Instead of generating HTML dynamically on every request, the backend function reads from Firestore, structures the data, and writes a static `site-data.json` file into Firebase Storage. 

3. **Infrastructure (Firebase)**:
   - **Database**: Firestore. Data models are designed to be forward-compatible with multi-tenancy (multi-site) and multi-language, even if the MVP focuses on a single site.
   - **Storage**: Firebase Storage. Used for holding media assets and the final compiled `site-data.json`. Direct client-side uploads from the React app are preferred, secured strictly by Firebase Storage Security Rules.
   - **Auth**: Standard Firebase Auth (Email/Password).

## Development Guidelines

- **Local Emulators Only**: When writing, testing, or executing code for this project, always default to using the Firebase Local Emulators (`firebase.json` is configured for this). Avoid deploying to a live cloud environment unless explicitly requested.
- **Frontend Connectivity**: The `admin/src/firebase.ts` file is already hardcoded to connect to the local emulators (`127.0.0.1`).
- **Styling Rules**: Keep styles within Tailwind utility classes where possible. For complex UI, write custom CSS in `index.css` using the `@apply` directive. Always prioritize visual excellence.
- **Database Rules**: Any additions to Firestore must eventually be secured via `firestore.rules`.
- **References**: A deep dive into the original CMS architecture is stored in `/data/dev/src/tiny-cms/referenced-cms/`. Refer to those markdown files if you need to understand the initial inspiration (e.g., how the multi-tenant `Site` model was originally structured).
