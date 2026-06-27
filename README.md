# Aura AI — Technically Driven Mental Health Platform

A high-performance, minimalist landing page and clinical-grade dashboard preview for **Aura AI**, an empathetic mental health platform powered by Google Gemini. Designed around high-conversion sign-up flows, social proof, and therapeutic micro-interactions.

Designed with the **Elegant Dark** design system featuring subtle gradients, high-contrast typography, and a modern, cohesive user experience.

---

## 🎨 Design Theme & Core Aesthetics

- **Elegant Dark Theme**: Fully immersive dark workspace background (`#0a0a0a`) paired with vibrant indigo accent hues (`#6366f1`), glowing blur effects, and soft off-white text colors.
- **Visual Silhouette**: Features a premium editorial graphic of a human head silhouette in dark profile, representing the neural flow of a beautifully balanced state of mind.
- **Micro-Interactions**: Features a real-time reactive mood slider, interactive CBT task checklists, customizable daily routines, and fluid hover states.
- **Live Beta Ticker**: A continuous marquee displaying dynamic, realistic peer registrations, highlighting reservation ranks in real-time.

---

## 🚀 Key Functional Features

### 1. Interactive Feelings Tracker
- Let users express their current mental state using a sleek 5-level mood slider or direct emoji selector grid (Anxious, Sad, Calm, Energetic, Tired).
- Re-aligns recommended mindfulness routines dynamically based on the active state.

### 2. Clinical AI Affirmation Generator (Powered by Gemini 3.5 Flash)
- Seamless server-side integration with `@google/genai` to generate custom therapeutic affirmations and sensory grounding activities tailored to active user moods.
- **Graceful Fallbacks**: Works perfectly even if no Gemini API key is configured by resorting to highly-curated clinical presets.

### 3. Dynamic Waitlist Wait Queue (Fidelity Conversion Form)
- Includes a multi-step onboarding waitlist form modal designed for maximum sign-up conversions.
- Lets users book a complimentary 15-minute VIP onboarding slot inside the waitlist flow, automatically skipping thousands of queue ranks.

### 4. Custom Mindfulness Routine Planner
- Includes a mini schedule tracker with custom user routine insertions and deletion logic to encourage active workspace play.

---

## 🛠️ Architecture & Tech Stack

This is a **Full-Stack (Vite + Express)** application that safely encapsulates API secrets server-side:

- **Frontend**: React 19, Vite, Tailwind CSS, Motion (Animations), Lucide React
- **Backend**: Node.js, Express, `@google/genai` TypeScript SDK, `tsx`, `esbuild`
- **Build System**: Auto-compiles the entire backend into a single, optimized `dist/server.cjs` file to bypass rigid ES module path resolution errors in Node.js container deployments.

---

## 💻 Local Development

### Prerequisites
Make sure you have Node.js and npm installed.

### Environment Setup
Create a `.env` file in the root directory or configure secrets in your host panel:
```env
GEMINI_API_KEY="your_api_key_here"
```

### Run Dev Server
```bash
npm run dev
```
The app will be accessible at `http://localhost:3000`.

### Production Build
```bash
npm run build
npm start
```
