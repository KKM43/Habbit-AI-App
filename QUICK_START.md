# Quick Start - Deploy AI Server & Update App

## ✅ Step 1: Notifications Fixed

Android 13+ notification permission has been added. Just rebuild your APK.

---

## 🚀 Step 2: Deploy AI Server (Render.com - 100% FREE!)

1. Go to **[render.com](https://render.com)** and sign up with GitHub (FREE, no credit card!)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Root Directory:** `habit-ai-server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** **Free** ✅
5. Add environment variable: `GROQ_API_KEY` = `your_groq_api_key`
   - Get API key from: https://console.groq.com/
6. Click **"Create Web Service"**
7. Wait 5-10 min, then copy your URL (e.g., `https://habit-ai-server.onrender.com`)

**Cost:** $0/month - Completely FREE! ✅

---

## 📱 Step 3: Update App with Server URL

### Option A: Quick Update (Recommended)

1. Open `src/config/aiConfig.js`
2. Replace the URL with your deployed server:
   ```javascript
   const AI_SERVER_URL = 'https://habit-ai-server.onrender.com';
   ```
   (Use YOUR actual Render URL)

### Option B: Environment Variable

When building, set:
```bash
EXPO_PUBLIC_AI_SERVER_URL=https://your-app.railway.app npx expo run:android --variant release
```

---

## 🔨 Step 4: Rebuild APK

```bash
npx expo run:android --variant release
```

Or use EAS Build:
```bash
eas build --platform android --profile production
```

---

## ✅ Done!

Your app now has:
- ✅ Android 13+ notification permissions
- ✅ AI server deployed to the cloud
- ✅ Production-ready APK

Test the AI feature in the app - it should work from anywhere!

