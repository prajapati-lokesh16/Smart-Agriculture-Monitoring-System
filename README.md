# Smart Agriculture Monitoring System

This repository contains a **production-ready** smart agriculture dashboard built with Next.js (App Router) and JavaScript. Key features:

- Firebase Realtime Database & Auth integration
- Responsive dashboard with charts (Recharts) and trend cards
- Moisture threshold configuration + smart notifications
- Export sensor data to CSV
- PWA support via `next-pwa` with notifications and service worker
- AI-driven insights and interactive chat powered by a secure Next.js API route
- Registration, login, password reset, and profile management (email & password change)
- Tailwind CSS styling, Lucide icons, and responsive layout

## Setup

1. Copy `.env.local.example` to `.env.local` and fill in your Firebase and OpenAI credentials (this file is ignored in Git):

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_DATABASE_URL=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

OPENAI_API_KEY=...
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Build for production:

```bash
npm run build && npm start
```

## Routes

- `/` – authenticated dashboard
- `/login` – sign‑in page
- `/register` – create an account
- `/profile` – user profile & logout

The dashboard displays live sensor readings, AI insights/chat, and push notifications when thresholds are crossed.

