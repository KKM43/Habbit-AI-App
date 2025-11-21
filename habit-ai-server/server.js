// habit-ai-server/server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const GROQ_API_KEY = process.env.GROQ_API_KEY;

app.post('/suggest-habits', async (req, res) => {
  const goal = req.body.goal?.trim();
  if (!goal) return res.json([]);

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",   // ← CURRENT BEST MODEL (Nov 2025)
        messages: [
          { 
            role: "system", 
            content: "Return exactly 5 habits as a JSON array with 'name' and 'category'. NO extra text, NO markdown. Example: [{\"name\":\"Meditate 10 min\",\"category\":\"Mindfulness\"}]" 
          },
          { role: "user", content: goal }
        ],
        temperature: 0.8,
        max_tokens: 400
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.log('Groq error:', err);
      throw new Error('API error');
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';

    console.log('Raw Groq output:', content.trim());

    let suggestions = [];
    try {
      suggestions = JSON.parse(content);
    } catch {
      const match = content.match(/\[[\s\S]*\]/);
      if (match) suggestions = JSON.parse(match[0]);
    }

    if (Array.isArray(suggestions) && suggestions.length > 0) {
      res.json(suggestions.slice(0, 5));
    } else {
      throw new Error('Invalid response');
    }

  } catch (error) {
    console.error('Groq failed:', error.message);
    res.json([
      { name: "Start with just 2 minutes", category: "Momentum" },
      { name: "Remove one distraction", category: "Focus" },
      { name: "Do it at the same time daily", category: "Consistency" },
      { name: "Track it visibly", category: "Accountability" },
      { name: "Reward yourself", category: "Motivation" }
    ]);
  }
});

app.post('/motivation', (req, res) => {
  const msgs = [
    "You're not lazy — you're in training mode!",
    "Future you is thanking present you right now.",
    "Champions don't wait for motivation — they build habits.",
    "Every day you show up, you win."
  ];
  res.json({ message: msgs[Math.floor(Math.random() * msgs.length)] });
});

app.get('/', (req, res) => res.send('GROQ HABIT AI IS ALIVE AND GOD TIER!'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n✅ GROQ AI SERVER RUNNING!`);
  console.log(`🌐 Port: ${PORT}`);
  console.log(`🔑 API Key: ${GROQ_API_KEY ? 'Configured' : 'MISSING!'}`);
  console.log(`📝 Test with: "stop procrastinating", "fix sleep", "learn Spanish"\n`);
});