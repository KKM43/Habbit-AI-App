# Deployment Guide - Habit Tracker App

This guide will help you deploy both the React Native app and the AI server.

## 📱 Part 1: Fix Notifications (Already Done ✅)

The Android 13+ notification permission has been added to:
- `android/app/src/main/AndroidManifest.xml` - Added `POST_NOTIFICATIONS` permission
- `app.json` - Added notification plugin configuration

**Next Steps:**
1. Rebuild your APK: `npx expo run:android --variant release`
2. The app will now request notification permission on Android 13+

---

## 🤖 Part 2: Deploy AI Server (100% FREE Options)

### Option 1: Render.com (BEST FREE OPTION) ⭐ RECOMMENDED

**✅ Completely Free - No Credit Card Required!**

1. **Go to [render.com](https://render.com)**
2. **Sign up** with GitHub (free account, no credit card needed)
3. **Click "New +"** → **"Web Service"**
4. **Connect your GitHub repository**
5. **Configure settings:**
   - **Name:** `habit-ai-server` (or any name)
   - **Root Directory:** `habit-ai-server` (important!)
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** **Free** ✅
6. **Add Environment Variable:**
   - Scroll down to "Environment Variables"
   - Click "Add Environment Variable"
   - **Key:** `GROQ_API_KEY`
   - **Value:** Your Groq API key
7. **Click "Create Web Service"**
8. **Wait 5-10 minutes** for first deployment
9. **Copy your URL:** Your app will be at `https://habit-ai-server.onrender.com` (or your custom name)

**Note:** Free tier sleeps after 15 min of inactivity (takes ~30 sec to wake up). Perfect for your use case!

**Cost:** $0/month - 100% Free Forever ✅

---

### Option 2: Fly.io (Alternative Free Option) 🆓

**✅ Also Free - Great Alternative**

1. **Install Fly CLI:**
   - Windows: Download from https://fly.io/docs/getting-started/installing-flyctl/
   - Or use PowerShell: `iwr https://fly.io/install.ps1 -useb | iex`

2. **Login:**
   ```bash
   cd habit-ai-server
   fly auth login
   ```

3. **Launch app:**
   ```bash
   fly launch
   ```
   - Choose a name (e.g., `habit-ai-server`)
   - Choose a region
   - Don't deploy yet (say no)

4. **Set API key:**
   ```bash
   fly secrets set GROQ_API_KEY=your_api_key_here
   ```

5. **Deploy:**
   ```bash
   fly deploy
   ```

6. **Get URL:** Your app will be at `https://habit-ai-server.fly.dev`

**Cost:** Free tier includes 3 shared-cpu VMs - Perfect for this! ✅

---

### Option 3: Railway (Limited Free - Not Recommended)

⚠️ **Note:** Railway's free tier is very limited now. Use Render.com instead for better free tier.

If you still want to use Railway:
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Create New Project → "Deploy from GitHub repo"
4. Select `habit-ai-server` folder
5. Add Environment Variable: `GROQ_API_KEY`
6. Railway will auto-deploy

**Cost:** Very limited free tier, may require payment

**Recommendation:** Use **Render.com** instead - it's completely free! ✅

1. **Install Fly CLI:** https://fly.io/docs/getting-started/installing-flyctl/
2. **Login:** `fly auth login`
3. **Create app:** `fly launch` (in `habit-ai-server` folder)
4. **Set secrets:**
   ```bash
   fly secrets set GROQ_API_KEY=your_api_key_here
   ```
5. **Deploy:** `fly deploy`
6. **Get URL:** Your app will be at `https://your-app.fly.dev`

**Cost:** Free tier includes 3 shared VMs - Perfect for this! ✅

---

## 📲 Part 3: Update React Native App

After deploying your server, you need to update the app to use the new URL:

### Method 1: Direct Update (Quick)

1. **Edit `src/utils/ai.js`:**
   ```javascript
   const AI_SERVER_URL = 'https://your-deployed-server.railway.app';
   ```
2. **Rebuild APK:**
   ```bash
   npx expo run:android --variant release
   ```

### Method 2: Environment Variable (Recommended)

1. **Create `.env` file in project root:**
   ```bash
   EXPO_PUBLIC_AI_SERVER_URL=https://your-deployed-server.railway.app
   ```

2. **Install expo-constants (if not already):**
   ```bash
   npm install expo-constants
   ```

3. **Update `src/utils/ai.js`:**
   ```javascript
   import Constants from 'expo-constants';
   
   const AI_SERVER_URL = Constants.expoConfig?.extra?.aiServerUrl || 
                         process.env.EXPO_PUBLIC_AI_SERVER_URL || 
                         'http://192.168.1.8:3001';
   ```

4. **Or use babel-plugin-transform-inline-environment-variables:**
   ```bash
   npm install --save-dev babel-plugin-transform-inline-environment-variables
   ```
   
   Add to `babel.config.js`:
   ```javascript
   plugins: [
     ['transform-inline-environment-variables', {
       include: ['EXPO_PUBLIC_AI_SERVER_URL']
     }]
   ]
   ```

---

## 🔑 Getting Groq API Key

1. **Go to [console.groq.com](https://console.groq.com/)**
2. **Sign up** (free account)
3. **Go to API Keys** section
4. **Create new API key**
5. **Copy the key** (starts with `gsk_`)

**Note:** Groq offers generous free tier for API usage!

---

## ✅ Testing Deployment

1. **Test your server:**
   ```bash
   curl https://your-server.railway.app/
   # Should return: "GROQ HABIT AI IS ALIVE AND GOD TIER!"
   ```

2. **Test AI endpoint:**
   ```bash
   curl -X POST https://your-server.railway.app/suggest-habits \
     -H "Content-Type: application/json" \
     -d '{"goal":"get fit"}'
   ```

3. **Test in app:**
   - Open app
   - Go to AI tab
   - Enter a goal
   - Should get AI suggestions (or fallback if server down)

---

## 📋 Checklist

- [ ] Deployed AI server to cloud platform
- [ ] Set `GROQ_API_KEY` environment variable
- [ ] Copied deployed server URL
- [ ] Updated `src/utils/ai.js` with production URL
- [ ] Rebuilt APK with new configuration
- [ ] Tested AI suggestions feature in app
- [ ] Verified notifications work on Android 13+

---

## 🐛 Troubleshooting

**AI suggestions not working:**
- Check server URL is correct
- Verify server is deployed and running
- Check server logs for errors
- Ensure `GROQ_API_KEY` is set correctly
- Test server URL in browser/curl

**Notifications not working:**
- Rebuild APK after changes
- Check app settings for notification permissions
- Ensure Android 13+ device for `POST_NOTIFICATIONS`

**Server deployment issues:**
- Check build logs in deployment platform
- Verify `package.json` has `start` script
- Ensure Node.js version is compatible (18+)
- Check environment variables are set correctly

---

## 📞 Support

If you encounter issues:
1. Check server logs in deployment platform
2. Test server endpoints manually
3. Verify environment variables
4. Check app console logs for errors

