<div align="center">
  <h1>⚽ RouteToGlory</h1>
  
  <p>
    <strong>The ultimate interactive football trivia experience. Test your knowledge by guessing players based on their career paths, transfers, trophies, and nationalities!</strong>
  </p>

  <p>
    <a href="https://routetoglory.netlify.app"><strong>View Live Demo</strong></a> ·
    <a href="https://github.com/Dhivakar001/RouteToGlory/issues">Report Bug</a> ·
    <a href="https://github.com/Dhivakar001/RouteToGlory/issues">Request Feature</a>
  </p>

  <p>
    <img alt="React" src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" />
    <img alt="Firebase" src="https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase" />
    <img alt="Vite" src="https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white" />
    <img alt="Netlify" src="https://img.shields.io/badge/netlify-%23000000.svg?style=for-the-badge&logo=netlify&logoColor=#00C7B7" />
  </p>
</div>

<br />

## 🌟 About The Project

**RouteToGlory** is a modern, high-performance web application designed for football (soccer) enthusiasts. It challenges users to identify mystery footballers using progressive hints such as their club history, international caps, and major trophies won. 

Whether you're a casual fan or a football historian, RouteToGlory offers multiple game modes to test your expertise.

### ✨ Key Features
- **🎮 Multiple Game Modes:** Play Classic (Career Path), Trophy, Nationality, Time Attack, or the Daily Challenge.
- **🔐 Secure Authentication:** Seamless Google Sign-In, Email/Password, or Anonymous Guest play via Firebase Auth.
- **💾 Persistent Progress:** Your scores, streaks, and achievements are securely saved to your Firebase profile and instantly restored upon login.
- **🏆 Global Leaderboards:** Compete against other players worldwide for the highest streak and score.
- **📱 PWA Ready:** Install the app directly to your mobile or desktop home screen for a native-like experience.
- **🎨 Premium UI/UX:** Built with a custom dark-mode design system, utilizing Framer Motion for buttery-smooth micro-animations.

---

## 🛠️ Architecture & Tech Stack

- **Frontend Framework:** React 18 powered by Vite for lightning-fast HMR and optimized production builds.
- **State Management:** Custom React Context API combined with `useReducer` for complex game state handling.
- **Backend Services:** 
  - **Firebase Auth:** Secure user identity management.
  - **Firestore Database:** Real-time NoSQL database protected by robust security rules.
- **Routing:** React Router v6 (SPA routing).
- **Hosting:** Deployed on Netlify with automated CI/CD pipelines, strict Content Security Policies (CSP), and optimized manual chunking.

---

## 🚀 Getting Started Locally

To get a local copy up and running, follow these simple steps.

### Prerequisites
- Node.js (v20 or higher recommended)
- A Firebase Project

### Installation

1. Clone the repo:
   ```sh
   git clone https://github.com/Dhivakar001/RouteToGlory.git
   cd RouteToGlory
   ```

2. Install NPM packages:
   ```sh
   npm install
   ```

3. Setup your Environment Variables:
   Create a `.env` file in the root directory and add your Firebase config (refer to `.env.example`):
   ```env
   VITE_FIREBASE_API_KEY="your-api-key"
   VITE_FIREBASE_AUTH_DOMAIN="your-auth-domain"
   VITE_FIREBASE_PROJECT_ID="your-project-id"
   VITE_FIREBASE_STORAGE_BUCKET="your-storage-bucket"
   VITE_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
   VITE_FIREBASE_APP_ID="your-app-id"
   ```

4. Start the development server:
   ```sh
   npm run dev
   ```

---

## 🌐 Deployment

This project is pre-configured for **Netlify**. Simply connect your repository to Netlify, add your environment variables in the Netlify dashboard, and the `netlify.toml` file will automatically handle the build commands, SPA routing, and security headers.

---

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.
