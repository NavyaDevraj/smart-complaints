require('dotenv').config();

const GEMINI_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`;
async function callGemini(prompt) {
  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(JSON.stringify(data));
  return data.candidates[0].content.parts[0].text;
}

exports.analyzeComplaint = async (req, res) => {
  const { description } = req.body;
  if (!description) return res.status(400).json({ message: 'Description required' });

  try {
    const prompt = `
      You are an AI assistant for a government citizen complaint management system in India.
      Analyze this citizen complaint: "${description}"
      Reply ONLY with valid JSON, no markdown, no extra text:
      {
        "category": "garbage" or "pothole" or "water_leakage",
        "priority": number 1-10,
        "urgency": "Low" or "Medium" or "High" or "Critical",
        "summary": "one sentence under 15 words",
        "suggestion": "one action for admin under 15 words"
      }
    `;
    const text = await callGemini(prompt);
    const clean = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);
    res.json(parsed);
  } catch (err) {
    console.error('Gemini error:', err.message);
    res.status(500).json({ message: 'AI analysis failed' });
  }
};

exports.chatbot = async (req, res) => {
  const { message, userId } = req.body;
  const db = require('../config/db');

  try {
    const [complaints] = await db.query(
      `SELECT c.title, c.status, c.location, c.created_at, cat.name as category
       FROM complaints c
       JOIN categories cat ON c.category_id = cat.id
       WHERE c.citizen_id = ?
       ORDER BY c.created_at DESC LIMIT 10`,
      [userId]
    );

    const prompt = `
      You are a helpful government portal assistant for Smart Complaints India.
      Citizen complaints: ${JSON.stringify(complaints)}
      Question: "${message}"
      Reply friendly and professionally in 2-3 sentences.
    `;
    const reply = await callGemini(prompt);
    res.json({ reply });
  } catch (err) {
    console.error('Chatbot error:', err.message);
    res.status(500).json({ message: 'Chatbot failed' });
  }
};