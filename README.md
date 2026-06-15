# RouteToGlory ⚽

RouteToGlory is an interactive football trivia web application where fans can test their knowledge by guessing football players based on their career paths, trophies, and nationalities.

## Features
- **Dynamic Game Modes:** Classic (Career Path), Trophy, Nationality, Time Attack, and Daily Challenge.
- **Persistent Profiles:** Authentication via Firebase (Google Sign-In, Email/Password, Guest) with automatic progress syncing.
- **Live Leaderboards:** Compete with others based on your high scores and streaks.
- **PWA Support:** Installable as a Progressive Web App on mobile and desktop.
- **Security First:** Robust Firebase Firestore and Storage security rules, complete input sanitization, and strict Content Security Policies.

## Tech Stack
- **Frontend:** React 18, Vite, React Router DOM
- **UI/UX:** Vanilla CSS (Custom Design System), Framer Motion, Lucide React
- **Backend:** Firebase (Authentication, Firestore, Storage)

## Local Development

### Prerequisites
- Node.js (v20 or higher recommended)
- A Firebase Project (for Authentication and Firestore)

### Setup

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment Variables:**
   Create a `.env` file in the root directory based on `.env.example`:
   ```bash
   VITE_FIREBASE_API_KEY="your-api-key"
   VITE_FIREBASE_AUTH_DOMAIN="your-app.firebaseapp.com"
   VITE_FIREBASE_PROJECT_ID="your-project-id"
   VITE_FIREBASE_STORAGE_BUCKET="your-app.appspot.com"
   VITE_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
   VITE_FIREBASE_APP_ID="1:your-app-id:web:your-web-id"
   VITE_FIREBASE_MEASUREMENT_ID="G-your-measurement-id"
   ```

3. **Start the Development Server:**
   ```bash
   npm run dev
   ```

## Deployment to Netlify

This project is pre-configured for seamless deployment to Netlify via the `netlify.toml` file.

1. Connect your GitHub repository to Netlify.
2. The build settings will automatically be detected:
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`
3. Add your Firebase Environment Variables in the Netlify Dashboard (**Site configuration > Environment variables**).
4. Deploy!

### Netlify Configuration Details
- **SPA Routing:** Redirects all paths to `index.html` (HTTP 200).
- **Security Headers:** Enforces CSP, strict `Referrer-Policy`, and configures `Cross-Origin-Opener-Policy` to support Google OAuth popups.
- **Node Version:** Forces Node 20 via `NODE_VERSION` for Firebase compatibility.
