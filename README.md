# HabitFlow – Your AI-Powered Habit Tracker
**Build better habits with AI coaching, streak protection, daily tasks, and beautiful dark mode.**

HabitFlow is a **full-featured, mobile-first habit tracker** built with **React Native (Expo)**, **Firebase**, and **Groq AI**.  
It helps you track habits, protect streaks, get personalized weekly reviews from real AI, and never miss a day.


### Features

- **Email Sign-in** (Firebase Auth)
-**Habits with streaks**, 30-day calendar view & edit/delete
-**Streak Freeze** (2 per month – save your streak when life happens)
-**Daily 5 Focus Tasks** (editable, checkable, persistent)
-**Groq AI-powered** habit suggestions, motivation & weekly personal review
-**Local push notifications** (daily reminders)
-**Beautiful dark/light mode** with smooth animations
-**Delete all data** (nuclear option with double confirmation)
-**Production-ready** (Expo, Render backend, APK build instructions)

### Tech Stack

- **Frontend**: React Native + Expo (SDK 51)
- **Backend/Auth/Database**: Firebase (Auth, Firestore)
- **AI**: Groq (Llama 3.3 70B) – running on Render
- **Notifications**: Expo Notifications
- **UI**: Custom theme context, LinearGradient, Ionicons
- **Navigation**: React Navigation (Tabs + Stack)

### Quick Start (Local Development)

1. Clone the repo
git clone https://github.com/KKM43/Habbit-AI-App.git

2.Install dependencies : npm install or yarn install

3. Start the AI server (in a separate terminal) : 
cd habit-ai-server
npm install
node server.js

4.Run the app : 
npx expo start --clear

5.Open on your phone via Expo Go or emulator
