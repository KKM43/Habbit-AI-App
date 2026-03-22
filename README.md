# HabitFlow – Your AI-Powered Habit Tracker

Build better habits with **AI coaching**, **streak protection**, **daily tasks**, and **beautiful dark mode**.

HabitFlow is a full-featured, mobile-first habit tracker built with **React Native (Expo)**, **Firebase**, and **Groq AI**.  
It helps you track habits, protect streaks, get personalized weekly reviews from real AI, and never miss a day.

## Features

-**Email Sign-in** (Firebase Auth)
-**Habits** with streaks, 30-day calendar view & edit/delete
-**Streak Freeze** (2 per month – save your streak when life happens)
-**Daily 5 Focus Tasks** (editable, checkable, persistent)
-**Groq AI-powered** habit suggestions, motivation & weekly personal review
-**Local push notifications** (daily reminders)
-**Beautiful dark/light mode** with smooth animations
-**Delete all data** (nuclear option with double confirmation)
-**Production-ready** (Expo, Render backend, APK build instructions)

## Tech Stack

- **Frontend**: React Native + Expo (SDK 51)
- **Backend/Auth/Database**: Firebase (Auth, Firestore)
- **AI**: Groq (Llama 3.3 70B) – running on Render
- **Notifications**: Expo Notifications
- **UI**: Custom theme context, LinearGradient, Ionicons
- **Navigation**: React Navigation (Tabs + Stack)

## Quick Start (Local Development)

1. **Clone the repo**
   ```bash
   git clone https://github.com/KKM43/Habbit-AI-App.git
   cd Habbit-AI-App

Install dependencies: 
npm install
# or
yarn install
Start the AI server (in a separate terminal)
cd habit-ai-server
npm install
node server.js
Run the app
npx expo start --clear
Open on your phone via Expo Go or emulator

Production Setup
Deploy AI Server (Render)

Push your habit-ai-server folder to GitHub
Create new service on Render → Node → connect repo
Set environment variable: GROQ_API_KEY=your-key
Deploy → get URL (e.g. https://habit-ai-server.onrender.com)

Update src/config/aiConfig.js
JavaScriptexport default 'https://your-render-url.onrender.com';
Build APK
Bashnpx eas build --profile preview --platform android
Contributing
Pull requests welcome!
Especially interested in:

iOS-specific fixes
More AI prompts/templates
Widget support
Habit templates gallery
