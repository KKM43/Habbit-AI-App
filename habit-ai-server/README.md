# Habit Tracker AI Server

Node.js server that provides AI-powered habit suggestions using Groq API.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Add your Groq API key to `.env`:
```
GROQ_API_KEY=your_api_key_here
```

Get your API key from: https://console.groq.com/

4. Run locally:
```bash
npm start
```

Server runs on `http://localhost:3001`

## Deploy to Render.com (BEST FREE OPTION) ⭐

**✅ 100% Free - No Credit Card Required!**

1. Go to [render.com](https://render.com)
2. Sign up/login with GitHub (completely free)
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Root Directory:** `habit-ai-server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** **Free** ✅
6. Add environment variable:
   - Key: `GROQ_API_KEY`
   - Value: Your Groq API key (get from https://console.groq.com/)
7. Click "Create Web Service"
8. Wait 5-10 minutes for deployment
9. Copy the public URL (e.g., `https://habit-ai-server.onrender.com`)

**Cost:** $0/month - Completely Free Forever! ✅

**Note:** Free tier sleeps after 15 min inactivity (~30 sec wake time). Perfect for your use!

## Deploy to Render (Alternative)

1. Go to [render.com](https://render.com)
2. Sign up/login
3. Click "New +" → "Web Service"
4. Connect your GitHub repo
5. Settings:
   - Build Command: `npm install`
   - Start Command: `npm start`
6. Add environment variable: `GROQ_API_KEY`
7. Deploy!

## Deploy to Heroku

1. Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli
2. Login: `heroku login`
3. Create app: `heroku create your-app-name`
4. Set API key: `heroku config:set GROQ_API_KEY=your_key`
5. Deploy: `git push heroku main`

## After Deployment

1. Copy your deployed server URL (e.g., `https://your-app.railway.app`)
2. Update `src/utils/ai.js` in your React Native app:
   ```javascript
   const AI_SERVER_URL = 'https://your-app.railway.app';
   ```
   Or use environment variable:
   ```bash
   EXPO_PUBLIC_AI_SERVER_URL=https://your-app.railway.app expo build:android
   ```

## API Endpoints

- `POST /suggest-habits` - Get AI habit suggestions
  - Body: `{ "goal": "your goal here" }`
  - Returns: Array of habit suggestions

- `POST /motivation` - Get motivational message
  - Returns: `{ "message": "motivational text" }`

- `GET /` - Health check
  - Returns: Server status message

