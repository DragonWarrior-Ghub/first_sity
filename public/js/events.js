// public/js/events.js
const form      = document.getElementById('eventForm');
const tableBody = document.querySelector('#eventsTable tbody');
const token     = localStorage.getItem('token');
const user      = JSON.parse(localStorage.getItem('user') || 'null');

// Скрываем форму создания, если не организатор
if (!user || user.role !== 'organizer') {
  document.getElementById('eventFormContainer').style.display = 'none';
}

// Загрузка и рендеринг списка мероприятий
async function loadEvents() {
  try {
    const res = await fetch('/api/events', {
      headers: token ? { 'Authorization': 'Bearer ' + token } : {}
    });
    if (!res.ok) throw new Error(res.status);
    const events = await res.json();
    tableBody.innerHTML = '';
    events.forEach(ev => {
      const tr = document.createElement('tr');
      // Базовые колонки
      tr.innerHTML = `
        <td>${ev.id}</td>
        <td>${ev.title}</td>
        <td>${ev.description || ''}</td>
        <td>${new Date(ev.start_time).toLocaleString()}</td>
        <td>${new Date(ev.end_time).toLocaleString()}</td>
        <td>${ev.organizer_id}</td>
        <td>${ev.max_participants}</td>
        <td>${ev.registered_count || 0}</td>
      `;
      // Кнопка «+» для волонтёров
      if (user && user.role === 'volunteer') {
        const td = document.createElement('td');
        const btn = document.createElement('button');
        btn.textContent = '+';
        btn.className = 'action-btn';
        btn.onclick = () => registerEvent(ev.id);
        td.appendChild(btn);
        tr.appendChild(td);
      }
      tableBody.appendChild(tr);
    });
  } catch (e) {
    console.error(e);
    alert('Ошибка загрузки мероприятий');
  }
}

// Создание нового мероприятия
form.addEventListener('submit', async e => {
  e.preventDefault();
  const payload = {
    title:            form.title.value.trim(),
    description:      form.description.value.trim(),
    start_time:       form.start_time.value,
    end_time:         form.end_time.value,
    max_participants: +form.max_participants.value || 0
  };
  if (new Date(payload.end_time) <= new Date(payload.start_time)) {
    return alert('Дата окончания должна быть позже начала');
  }
  try {
    const res = await fetch('/api/events', {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => null);
      throw new Error(err?.message || res.status);
    }
    form.reset();
    await loadEvents();
  } catch (err) {
    console.error(err);
    alert('Ошибка создания: ' + err.message);
  }
});

// Регистрация волонтёра на событие
async function registerEvent(eventId) {
  try {
    const res = await fetch(`/api/events/${eventId}/register`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });
    if (!res.ok) {
      const err = await res.json().catch(() => null);
      throw new Error(err?.message || res.status);
    }
    alert('Вы успешно зарегистрировались!');
    await loadEvents();
  } catch (err) {
    console.error(err);
    alert('Ошибка регистрации: ' + err.message);
  }
}

// Инициируем загрузку
document.addEventListener('DOMContentLoaded', loadEvents);
