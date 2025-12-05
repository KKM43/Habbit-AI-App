// AI Server Configuration
// Update this file with your deployed server URL

// For local development:
// const AI_SERVER_URL = 'http://192.168.1.8:3001';

// For production (after deploying to Railway/Render/etc.):
// Replace with your deployed server URL (e.g., https://your-app.railway.app)
const AI_SERVER_URL = process.env.EXPO_PUBLIC_AI_SERVER_URL || 'https://habit-ai-server.onrender.com'|| 'http://192.168.1.8:3001';

// Uncomment and set your production URL here:
// const AI_SERVER_URL = 'https://your-deployed-server.railway.app';

export default AI_SERVER_URL;

