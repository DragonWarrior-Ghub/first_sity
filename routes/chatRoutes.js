// routes/chatRoutes.js
const express = require('express');
const fetch   = require('node-fetch');
const router  = express.Router();

const LM_URL   = process.env.LM_STUDIO_URL;
const LM_MODEL = process.env.LM_STUDIO_MODEL;

// POST /api/chat
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const resp = await fetch(`${LM_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: LM_MODEL,
        messages: [{ role: 'user', content: message }]
      })
    });
    if (!resp.ok) {
      const text = await resp.text();
      return res.status(resp.status).json({ response: `LM error: ${text}` });
    }
    const data = await resp.json();
    const reply = data.choices?.[0]?.message?.content || '';
    res.json({ response: reply });
  } catch (err) {
    console.error('Chat proxy error:', err);
    res.status(500).json({ response: err.message });
  }
});

module.exports = router;
