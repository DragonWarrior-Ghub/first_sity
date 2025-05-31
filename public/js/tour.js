document.addEventListener('DOMContentLoaded', async function() {
  const container = document.getElementById('tour-detail');
  const id = Number(new URLSearchParams(window.location.search).get('id'));
  if (!id) return container.innerHTML = '<p>Неверный ID тура.</p>';

  // 1) Получаем данные с галереей (поле gallery)
  let tour;
  try {
    const res = await fetch(`/api/tours/${id}`);
    if (!res.ok) throw new Error('Тур не найден');
    tour = await res.json();
  } catch (e) {
    return container.innerHTML = `<p>Ошибка: ${e.message}</p>`;
  }

  // 2) Заголовок
  const h2 = document.createElement('h2');
  h2.textContent = tour.title;

  // 3) Слайдер галереи
  let slider;
  if (Array.isArray(tour.gallery) && tour.gallery.length) {
    slider = document.createElement('div');
    slider.className = 'tour-gallery';

    // контейнер слайдов
    const slides = document.createElement('div');
    slides.className = 'slides';
    tour.gallery.forEach(src => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = tour.title;
      slides.appendChild(img);
    });
    slider.appendChild(slides);

    // кнопки
    const btnPrev = document.createElement('button');
    btnPrev.className = 'nav-btn prev';
    btnPrev.textContent = '‹';
    const btnNext = document.createElement('button');
    btnNext.className = 'nav-btn next';
    btnNext.textContent = '›';
    slider.append(btnPrev, btnNext);

    // логика переключения
    let current = 0;
    const count = tour.gallery.length;
    function update() {
      slides.style.transform = `translateX(-${current * 100}%)`;
    }
    btnPrev.onclick = () => {
      current = (current - 1 + count) % count;
      update();
    };
    btnNext.onclick = () => {
      current = (current + 1) % count;
      update();
    };
  }

  // 4) Описание
  const desc = document.createElement('div');
  desc.innerHTML = tour.fullDesc || tour.shortDesc;

  // 5) Цена
  const price = document.createElement('p');
  price.innerHTML = `<strong>Цена:</strong> ${tour.price} ₽`;

  // 6) Кнопка корзины
  const btnContainer = document.createElement('div');
  async function initCartBtn() {
    const cartRes = await fetch('/api/cart');
    const items = cartRes.ok ? await cartRes.json() : [];
    const inCart = items.some(i => i.tourId === id);
    btnContainer.innerHTML = '';
    if (inCart) {
      const a = document.createElement('a');
      a.href = 'cart.html';
      a.textContent = 'Перейти в корзину';
      a.className = 'btn';
      btnContainer.appendChild(a);
    } else {
      const b = document.createElement('button');
      b.textContent = 'Добавить в корзину';
      b.className = 'btn';
      b.onclick = async () => {
        const r = await fetch('/api/cart', {
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body: JSON.stringify({ tourId: id })
        });
        if (r.ok) initCartBtn();
        else alert((await r.json()).error || 'Ошибка');
      };
      btnContainer.appendChild(b);
    }
  }
  await initCartBtn();

  // 7) Сборка DOM
  container.append(h2);
  if (slider) container.append(slider);
  container.append(desc, price, btnContainer);
});
