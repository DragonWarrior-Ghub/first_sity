// public/js/chat.js
document.addEventListener('DOMContentLoaded', () => {
    const chatLog   = document.getElementById('chatLog');
    const chatInput = document.getElementById('chatInput');
    const sendBtn   = document.getElementById('sendBtn');
    const user      = JSON.parse(localStorage.getItem('user') || 'null');
    const token     = localStorage.getItem('token');
  
    function appendMessage(cls, text) {
      const div = document.createElement('div');
      div.className = `chat-message ${cls}`;
      div.textContent = text;
      chatLog.appendChild(div);
      chatLog.scrollTop = chatLog.scrollHeight;
    }
  
    async function sendMessage() {
      const msg = chatInput.value.trim();
      if (!msg) return;
      appendMessage('user', msg);
      chatInput.value = '';
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: msg })
        });
        const data = await res.json();
        appendMessage('ai', data.response || 'Ответ не получен.');
      } catch (err) {
        appendMessage('ai', 'Ошибка: ' + err.message);
      }
    }
    
  });
  
