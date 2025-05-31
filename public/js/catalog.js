console.log('catalog.js loaded');

const container     = document.getElementById('tours-container');
const inputSearch   = document.getElementById('search-input');
const btnSearch     = document.getElementById('search-button');
const selectCat     = document.getElementById('category-select');
const btnFilter     = document.getElementById('filter-button');

// Отрисовка карточек туров
function renderTours(tours) {
  container.innerHTML = '';
  if (!Array.isArray(tours) || tours.length === 0) {
    container.innerHTML = '<p>Туры не найдены.</p>';
    return;
  }
  tours.forEach(t => {
    const card = document.createElement('div');
    card.className = 'tour-item';
    card.innerHTML = `
      <img src="${t.image}" alt="${t.title}">
      <div>
        <h3><a href="tour.html?id=${t.id}">${t.title}</a></h3>
        <p><em>Категория: ${t.category}</em></p>
        <p>${t.shortDesc}</p>
        <p><strong>Мин–макс участников:</strong> ${t.minPeople}–${t.maxPeople}</p>
        <p><strong>Цена:</strong> ${t.price} ₽</p>
      </div>
    `;
    container.appendChild(card);
  });
}

// Загрузка туров с учётом поиска и категории
async function loadTours() {
  const query = inputSearch.value.trim();
  const cat   = selectCat.value;
  let url     = '/api/tours';
  if (query) {
    url += `?q=${encodeURIComponent(query)}`;
  }

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Сервер вернул ' + res.status);
    let tours = await res.json();

    // Клиентский фильтр по категории
    if (cat) {
      tours = tours.filter(t => t.category === cat);
    }

    renderTours(tours);
  } catch (err) {
    console.error('Error loading tours:', err);
    container.innerHTML = '<p>Ошибка при загрузке туров.</p>';
  }
}

// Привязываем кнопки
btnSearch.addEventListener('click', loadTours);
btnFilter.addEventListener('click', loadTours);

// Начальная загрузка
loadTours();
