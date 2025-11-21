// src/utils/dateUtils.js
export const getTodayString = () => {
  const today = new Date();
  return today.toISOString().split('T')[0]; // "2025-11-19"
};

export const getDatesArray = (daysBack = 30) => {
  const dates = [];
  for (let i = daysBack - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
};

// Calculate current & best streak (client-side, super fast)
export const calculateStreaks = (progressObj) => {
  if (!progressObj) return { current: 0, best: 0 };

  const sortedDates = Object.keys(progressObj)
    .filter(date => progressObj[date]?.status === 'done')
    .sort((a, b) => b.localeCompare(a)); // newest first

  if (sortedDates.length === 0) return { current: 0, best: 0 };

  let current = 0;
  let best = 0;
  let temp = 0;
  let prevDate = null;

  for (const date of sortedDates) {
    if (!prevDate) {
      temp = 1;
    } else {
      const prev = new Date(prevDate);
      const curr = new Date(date);
      const diffDays = (prev - curr) / (1000 * 60 * 60 * 24);
      if (diffDays === 1) {
        temp += 1;
      } else {
        best = Math.max(best, temp);
        temp = 1;
      }
    }
    prevDate = date;
  }
  best = Math.max(best, temp);

  // Current streak: only if yesterday or today was done
  const today = getTodayString();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (sortedDates[0] === today || sortedDates[0] === yesterdayStr) {
    current = temp;
    if (sortedDates[0] === yesterdayStr && sortedDates[1] !== today) {
      current = temp - 1; // broke today
    }
  }

  return { current, best: Math.max(best, current) };
};