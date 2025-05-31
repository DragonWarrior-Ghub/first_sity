// public/js/cart.js

document.addEventListener('DOMContentLoaded', () => {
  const container    = document.getElementById('cart-container');
  const summaryEl    = document.getElementById('cart-summary');
  const totalPriceEl = document.getElementById('total-price');
  const payBtn       = document.getElementById('payBtn');

  async function loadCart() {
    container.innerHTML = '';
    summaryEl.style.display = 'none';
    payBtn.disabled = true;

    try {
      const res = await fetch('/api/cart');
      if (!res.ok) throw new Error('Ошибка при загрузке корзины');
      const items = await res.json();

      if (!items.length) {
        container.innerHTML = '<p class="empty-cart">Ваша корзина пуста.</p>';
        return;
      }

      let total = 0;
      const table = document.createElement('table');
      table.className = 'cart-table';
      table.innerHTML = `
        <thead>
          <tr>
            <th>Название</th>
            <th>Кол-во мест</th>
            <th>Цена за место, ₽</th>
            <th>Сумма, ₽</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody></tbody>
      `;

      const tbody = table.querySelector('tbody');
      items.forEach(item => {
        const tr = document.createElement('tr');

        // Название
        const tdTitle = document.createElement('td');
        const link = document.createElement('a');
        link.href = `tour.html?id=${item.tourId}`;
        link.textContent = item.title;
        tdTitle.appendChild(link);

        // Кол-во мест
        const tdQty = document.createElement('td');
        const inputQty = document.createElement('input');
        inputQty.type = 'number';
        inputQty.min = '1';
        inputQty.value = item.quantity;
        inputQty.style.width = '60px';
        tdQty.appendChild(inputQty);

        // Цена за место
        const tdUnitPrice = document.createElement('td');
        tdUnitPrice.textContent = item.price;

        // Сумма
        const tdSum = document.createElement('td');
        const updateSum = () => {
          const qty = Number(inputQty.value);
          const sum = qty * item.price;
          tdSum.textContent = sum;
          recalcTotal();
        };
        tdSum.textContent = item.quantity * item.price;
        inputQty.addEventListener('change', updateSum);

        // Действия
        const tdAction = document.createElement('td');
        const btn = document.createElement('button');
        btn.className = 'btn-delete';
        btn.textContent = 'Удалить';
        btn.addEventListener('click', async () => {
          await removeItem(item.id);
        });
        tdAction.appendChild(btn);

        tr.append(tdTitle, tdQty, tdUnitPrice, tdSum, tdAction);
        tbody.appendChild(tr);
      });

      container.appendChild(table);

      // Функция перерасчёта итога
      function recalcTotal() {
        let newTotal = 0;
        container.querySelectorAll('tbody tr').forEach(row => {
          const sumCell = row.children[3];
          newTotal += Number(sumCell.textContent);
        });
        totalPriceEl.textContent = newTotal;
      }

      // Показываем итог и кнопку
      recalcTotal();
      summaryEl.style.display = 'block';
      payBtn.disabled = false;

    } catch (err) {
      container.innerHTML = `<p class="empty-cart">${err.message}</p>`;
    }
  }

  async function removeItem(itemId) {
    try {
      const res = await fetch(`/api/cart/${itemId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Ошибка при удалении');
      await loadCart();
    } catch (err) {
      alert(err.message);
    }
  }

  loadCart();
});