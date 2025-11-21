// src/utils/ai.js
import AI_SERVER_URL from '../config/aiConfig';

const fetchWithFallback = async (endpoint, body, fallback) => {
  try {
    console.log('Calling AI server:', `${AI_SERVER_URL}${endpoint}`);
    const response = await fetch(`${AI_SERVER_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const result = await response.json();
    console.log('AI server success:', result);
    return result;
  } catch (e) {
    console.log('AI server failed:', e.message);
    return fallback;
  }
};

export const suggestHabits = async (goal) => {
  return fetchWithFallback('/suggest-habits', { goal }, [
    { name: "Take a deep breath and start small", category: "Mindset" },
    { name: "Remove one distraction", category: "Focus" },
    { name: "Do the hardest thing first", category: "Productivity" },
    { name: "Track your progress daily", category: "Accountability" },
    { name: "Celebrate every win", category: "Motivation" }
  ]);
};

export const getMotivation = async () => {
  return fetchWithFallback('/motivation', {}, { message: "You're building the future you want — one habit at a time! 💪" });
};

export const getWeeklySummary = async (stats) => {
  return fetchWithFallback('/weekly-summary', stats, {
    summary: "Great effort this week!",
    recommendation: "Keep going — consistency wins!"
  });
};