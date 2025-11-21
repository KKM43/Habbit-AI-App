# 🆓 100% FREE Deployment Guide

Complete guide to deploy your Habit Tracker app and AI server **completely FREE** with no credit card required!

---

## ✅ What's Already Free

### Firebase (Already Configured) ✅
- **Authentication:** FREE - Unlimited users
- **Firestore Database:** FREE - 1 GB storage, 50K reads/day, 20K writes/day
- **Your app usage:** Well within free tier limits!

### Groq AI API ✅
- **Free tier:** 14,400 requests/day
- **Your usage:** ~5 requests per user per day
- **Can handle:** Thousands of users for FREE!

---

## 🚀 Deploy AI Server (100% FREE)

### Option 1: Render.com (Recommended - Easiest) ⭐

**Why Render?**
- ✅ No credit card required
- ✅ Completely free forever
- ✅ Easy GitHub integration
- ✅ Automatic deployments
- ✅ Free SSL certificate

**Step-by-Step:**

1. **Sign Up (Free)**
   - Go to [render.com](https://render.com)
   - Click "Get Started for Free"
   - Sign up with **GitHub** (easiest option)
   - **No credit card required!** ✅

2. **Create Web Service**
   - Click the **"New +"** button (top right)
   - Select **"Web Service"**
   - Connect your GitHub account (if not already)
   - Select your **HabitTracker** repository

3. **Configure Service**
   ```
   Name: habit-ai-server (or any name you like)
   Root Directory: habit-ai-server
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   Plan: Free ✅
   ```

4. **Add Environment Variable**
   - Scroll down to "Environment Variables"
   - Click "Add Environment Variable"
   - **Key:** `GROQ_API_KEY`
   - **Value:** Your Groq API key
     - Get it from: https://console.groq.com/
     - Sign up is free!
     - Copy the API key (starts with `gsk_`)

5. **Deploy!**
   - Click **"Create Web Service"**
   - Wait 5-10 minutes for first deployment
   - You'll see build logs in real-time

6. **Get Your URL**
   - Once deployed, your service will be live at:
   - `https://habit-ai-server.onrender.com` (or your custom name)
   - Copy this URL!

**Important Notes:**
- ⚠️ Free tier sleeps after 15 min of inactivity
- 🌙 First request after sleep takes ~30 seconds to wake up
- ✅ Perfect for your use case (not high-traffic)
- ✅ No credit card needed ever!

---

### Option 2: Fly.io (Alternative Free Option) 🆓

**Why Fly.io?**
- ✅ Generous free tier
- ✅ No sleep/spin-down
- ✅ Very fast
- ✅ CLI-based (more technical)

**Step-by-Step:**

1. **Install Fly CLI**
   - **Windows:** Open PowerShell and run:
     ```powershell
     iwr https://fly.io/install.ps1 -useb | iex
     ```
   - Or download from: https://fly.io/docs/getting-started/installing-flyctl/

2. **Login**
   ```bash
   cd habit-ai-server
   fly auth login
   ```
   - Opens browser for GitHub login
   - Free account, no credit card!

3. **Launch App**
   ```bash
   fly launch
   ```
   - Choose a name (e.g., `habit-ai-server`)
   - Choose a region near you
   - Say **"No"** to deploying now

4. **Set API Key**
   ```bash
   fly secrets set GROQ_API_KEY=your_api_key_here
   ```

5. **Deploy**
   ```bash
   fly deploy
   ```

6. **Get URL**
   - Your app will be at: `https://habit-ai-server.fly.dev`
   - Copy this URL!

**Free Tier Includes:**
- 3 shared-cpu VMs
- 3GB persistent volume storage
- 160GB outbound data transfer/month
- Perfect for your app! ✅

---

## 📱 Update Your React Native App

After deploying your server, update the app:

1. **Open:** `src/config/aiConfig.js`

2. **Update the URL:**
   ```javascript
   // For Render.com:
   const AI_SERVER_URL = 'https://habit-ai-server.onrender.com';
   
   // For Fly.io:
   // const AI_SERVER_URL = 'https://habit-ai-server.fly.dev';
   ```

3. **Save the file**

---

## 🔨 Build Your APK (Free - Local Build)

You can build your APK locally for free:

### Method 1: Expo Development Build (Free)
```bash
npx expo run:android --variant release
```

### Method 2: EAS Build (Free Tier Available)
```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Build (free tier: 30 builds/month)
eas build --platform android --profile production
```

### Method 3: Android Studio (Free)
1. Open `android` folder in Android Studio
2. Build → Generate Signed Bundle / APK
3. Follow the wizard

**All methods are FREE!** ✅

---

## ✅ Complete Free Stack Summary

| Service | Cost | What You Get |
|---------|------|--------------|
| **Firebase** | $0 | Auth + Database (free tier) |
| **Groq AI API** | $0 | 14,400 requests/day (free) |
| **Render.com** | $0 | AI Server hosting (free tier) |
| **APK Build** | $0 | Build locally (free) |
| **App Distribution** | $0 | Share APK directly (free) |

**Total Monthly Cost: $0.00** 🎉

---

## 🧪 Testing Your Deployment

1. **Test Server Health:**
   ```
   Visit: https://your-server.onrender.com
   Should see: "GROQ HABIT AI IS ALIVE AND GOD TIER!"
   ```

2. **Test AI Endpoint:**
   - Use a tool like Postman or curl:
   ```bash
   curl -X POST https://your-server.onrender.com/suggest-habits \
     -H "Content-Type: application/json" \
     -d '{"goal":"get fit"}'
   ```
   - Should return habit suggestions JSON

3. **Test in App:**
   - Open app → AI tab
   - Enter a goal
   - Should get AI suggestions!

---

## 🐛 Troubleshooting

### Server won't deploy on Render?
- ✅ Check "Root Directory" is set to `habit-ai-server`
- ✅ Verify `package.json` has `"start": "node server.js"`
- ✅ Check build logs for errors
- ✅ Ensure `GROQ_API_KEY` is set correctly

### Server sleeps (Render free tier)?
- ✅ Normal behavior - waits ~30 sec on first request
- ✅ This is fine for your use case
- ✅ Consider Fly.io if you need instant response

### AI not working in app?
- ✅ Verify server URL is correct in `src/config/aiConfig.js`
- ✅ Test server URL in browser first
- ✅ Check app console for errors
- ✅ Verify `GROQ_API_KEY` is set on server

---

## 📞 Need Help?

1. **Render Support:** https://community.render.com
2. **Fly.io Support:** https://community.fly.io
3. **Groq Support:** https://console.groq.com/docs

---

## 🎉 You're Done!

Everything is now deployed for **FREE**:
- ✅ AI Server running on Render.com (free)
- ✅ Firebase auth & database (free)
- ✅ Groq AI API (free tier)
- ✅ Ready to build APK (free)

**Total cost: $0.00/month forever!** 🎊

