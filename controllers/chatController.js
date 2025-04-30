// controllers/chatController.js
const axios = require('axios');
const LM_URL = process.env.LM_STUDIO_URL;
const MODEL  = process.env.LM_STUDIO_MODEL;

exports.chat = async (req, res) => {
  try {
    const { message } = req.body;

    // Формат v1/chat/completions
    const payload = {
      model: MODEL,
      messages: [
        { role: 'user', content: message }
      ]
    };

    const lmRes = await axios.post(`${LM_URL}/v1/chat/completions`, payload);
    // подстрахуем на случай, если структура чуть иная
    const aiReply = lmRes.data.choices?.[0]?.message?.content 
                  || lmRes.data.choices?.[0]?.text 
                  || 'Ответ не получен.';
    res.json({ response: aiReply });
  } catch (err) {
    console.error('Chat proxy error:', err.message);
    res.status(500).json({ response: 'Ошибка: ' + err.message });
  }
};
