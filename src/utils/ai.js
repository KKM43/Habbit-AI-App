// src/utils/ai.js
import AI_SERVER_URL from '../config/aiConfig';

const fetchWithFallback = async (endpoint, body, fallback) => {

  if (!AI_SERVER_URL || AI_SERVER_URL.trim() === '') {
    console.log('AI server URL not configured — using fallback');
    return fallback;
  }

  try {
    console.log(`Calling AI server: ${AI_SERVER_URL}${endpoint}`);
    console.log('Payload:', body);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); 

    const response = await fetch(`${AI_SERVER_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('AI server error:', errorText);
      throw new Error(`HTTP ${response.status}`);
    }

    const result = await response.json();
    console.log('AI server success:', result);
    return result;

  } catch (error) {
    if (error && error.name === 'AbortError') {
      console.log('AI request timed out');
    } else {
      console.log('AI server unreachable:', error && error.message ? error.message : String(error));
    }
    return fallback;
  }
};

export const suggestHabits = async (goal) => {
  return fetchWithFallback('/suggest-habits', { goal }, [
    { name: 'Take one small step today', category: 'Momentum' },
    { name: 'Track your progress', category: 'Accountability' },
    { name: 'Remove one distraction', category: 'Focus' },
    { name: 'Start with 5 minutes', category: 'Consistency' },
    { name: 'Celebrate every win', category: 'Motivation' }
  ]);
};

export const getWeeklySummary = async (stats) => {
  console.log('Sending to AI:', stats);
  return fetchWithFallback('/weekly-summary', stats, {
    summary: "You showed up this week — that's what matters most.",
    recommendation: 'Keep going. Small actions compound into massive results.'
  });
};

export const getMotivation = async () => {
  return fetchWithFallback('/motivation', {}, {
    message: "You're not just building habits — you're building a new version of yourself."
  });
};