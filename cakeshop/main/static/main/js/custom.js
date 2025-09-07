document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.querySelector('.file-icon input[type="file"]');
  const attachedFilesText = document.querySelector('.attached-files');

  fileInput.addEventListener('change', function () {
    const files = Array.from(this.files).map(file => file.name).join(', ');
    attachedFilesText.textContent = files || 'Файлы не выбраны';
  });

  const modals = {
    cake: document.getElementById('cake-modal'),
    cake2: document.getElementById('cake2-modal'),
    cream: document.getElementById('cream-modal'),
    design: document.getElementById('design-modal')
  };

  let currentLayerKey = null;
  let selectedOption = null;

  // 🔥 Клик по свечам
  const candles = document.querySelector('.candles');
  if (candles) {
    candles.style.cursor = 'pointer';
    candles.addEventListener('click', () => openModal('design'));
  }

  // 🔥 Клик по слоям
  document.querySelectorAll('[data-layer].clickable').forEach(el => {
    el.addEventListener('click', () => openModal(el.dataset.layer));
  });

  // 🔥 Открытие модалки
  function openModal(key) {
    currentLayerKey = key;
    selectedOption = null;

    document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));

    // Показать нужную модалку
    const modal = modals[key];
    if (modal) {
      modal.classList.remove('hidden');

      // Добавляем обработчик закрытия по клику вне модалки
      setTimeout(() => {
        function closeOnOutsideClick(e) {
          if (!modal.contains(e.target)) {
            closeModal();
            document.removeEventListener('mousedown', closeOnOutsideClick);
          }
        }

        document.addEventListener('mousedown', closeOnOutsideClick);
      }, 0);
    }
  }

  // 🔥 Закрытие всех модалок
  function closeModal() {
    Object.values(modals).forEach(modal => modal.classList.add('hidden'));
    currentLayerKey = null;
    selectedOption = null;
  }

  // 🔥 Крестики закрытия
  document.querySelectorAll('.close-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      closeModal();
    });
  });

  // 🔥 Выбор опции
  document.querySelectorAll('.option').forEach(option => {
    option.addEventListener('click', () => {
      document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
      option.classList.add('selected');
      selectedOption = option;
    });
  });

  // 🔥 Кнопки подтверждения
  const confirmButtons = {
    cake: document.getElementById('confirm-layer-btn-cake1'),
    cake2: document.getElementById('confirm-layer-btn-cake2'),
    cream: document.getElementById('confirm-layer-btn'),
    design: document.getElementById('confirm-design-btn')
  };

  Object.entries(confirmButtons).forEach(([key, btn]) => {
    if (!btn) return;

    btn.addEventListener('click', () => {
      if (!selectedOption || currentLayerKey !== key) {
        alert('Пожалуйста, выберите опцию');
        return;
      }

      const newText = selectedOption.dataset.text;
      const newClass = selectedOption.dataset.class;

      // === Если один из коржей — меняем оба ===
      if (key === 'cake' || key === 'cake2') {
        ['cake', 'cake2'].forEach(layerKey => {
          document.querySelectorAll(`[data-layer="${layerKey}"]`).forEach(el => {
            if (el.classList.contains('layer')) {
              el.className = `layer ${newClass} clickable`;

              const img = el.querySelector('img');
              if (img) {
                img.src = window.STATIC_URL + `main/img/boxes/${newClass}.png`;
                img.alt = newText;
              }
            } else if (el.classList.contains('text')) {
              el.textContent = newText;
            }
          });
        });
      }

      // === Крем
      else if (key === 'cream') {
        document.querySelectorAll('[data-layer="cream"]').forEach(el => {
          if (el.classList.contains('layer')) {
            el.className = `layer ${newClass} clickable`;

            const img = el.querySelector('img');
            if (img) {
              img.src = window.STATIC_URL + `main/img/boxes/${newClass}.png`;
              img.alt = newText;
            }
          } else if (el.classList.contains('text')) {
            el.textContent = newText;
          }
        });
      }

      // === Дизайн (свечи — только текст)
      else if (key === 'design') {
        document.querySelectorAll('[data-layer="design"]').forEach(el => {
          if (el.classList.contains('text')) {
            el.textContent = newText;
          }
        });
      }

      closeModal();
    });
  });
});
document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.querySelector('.file-icon input[type="file"]');
  const attachedFilesText = document.querySelector('.attached-files');

  fileInput.addEventListener('change', function () {
    const files = Array.from(this.files).map(file => file.name).join(', ');
    attachedFilesText.textContent = files || 'Файлы не выбраны';
  });

  const modals = {
    cake: document.getElementById('cake-modal'),
    cake2: document.getElementById('cake2-modal'),
    cream: document.getElementById('cream-modal'),
    design: document.getElementById('design-modal')
  };

  let currentLayerKey = null;
  let selectedOption = null;

  // 🔥 Клик по свечам
  const candles = document.querySelector('.candles');
  if (candles) {
    candles.style.cursor = 'pointer';
    candles.addEventListener('click', () => openModal('design'));
  }

  // 🔥 Клик по слоям
  document.querySelectorAll('[data-layer].clickable').forEach(el => {
    el.addEventListener('click', () => openModal(el.dataset.layer));
  });

  // 🔥 Открытие модалки
  function openModal(key) {
    currentLayerKey = key;
    selectedOption = null;

    document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));

    const modal = modals[key];
    if (modal) {
      modal.classList.remove('hidden');
      setTimeout(() => {
        function closeOnOutsideClick(e) {
          if (!modal.contains(e.target)) {
            closeModal();
            document.removeEventListener('mousedown', closeOnOutsideClick);
          }
        }
        document.addEventListener('mousedown', closeOnOutsideClick);
      }, 0);
    }
  }

  function closeModal() {
    Object.values(modals).forEach(modal => modal.classList.add('hidden'));
    currentLayerKey = null;
    selectedOption = null;
  }

  document.querySelectorAll('.close-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      closeModal();
    });
  });

  document.querySelectorAll('.option').forEach(option => {
    option.addEventListener('click', () => {
      document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
      option.classList.add('selected');
      selectedOption = option;
    });
  });

  const confirmButtons = {
    cake: document.getElementById('confirm-layer-btn-cake1'),
    cake2: document.getElementById('confirm-layer-btn-cake2'),
    cream: document.getElementById('confirm-layer-btn'),
    design: document.getElementById('confirm-design-btn')
  };

  Object.entries(confirmButtons).forEach(([key, btn]) => {
    if (!btn) return;
    btn.addEventListener('click', () => {
      if (!selectedOption || currentLayerKey !== key) {
        alert('Пожалуйста, выберите опцию');
        return;
      }

      const newText = selectedOption.dataset.text;
      const newClass = selectedOption.dataset.class;

      if (key === 'cake' || key === 'cake2') {
        ['cake', 'cake2'].forEach(layerKey => {
          document.querySelectorAll(`[data-layer="${layerKey}"]`).forEach(el => {
            if (el.classList.contains('layer')) {
              el.className = `layer ${newClass} clickable`;
              const img = el.querySelector('img');
              if (img) img.src = window.STATIC_URL + `main/img/boxes/${newClass}.png`;
              if (img) img.alt = newText;
            } else if (el.classList.contains('text')) el.textContent = newText;
          });
        });
      } else if (key === 'cream') {
        document.querySelectorAll('[data-layer="cream"]').forEach(el => {
          if (el.classList.contains('layer')) {
            el.className = `layer ${newClass} clickable`;
            const img = el.querySelector('img');
            if (img) img.src = window.STATIC_URL + `main/img/boxes/${newClass}.png`;
            if (img) img.alt = newText;
          } else if (el.classList.contains('text')) el.textContent = newText;
        });
      } else if (key === 'design') {
        document.querySelectorAll('[data-layer="design"]').forEach(el => {
          if (el.classList.contains('text')) el.textContent = newText;
        });
      }

      closeModal();
      updatePrice();
    });
  });

  // 🔥 Расчёт цены
  const priceRow = document.querySelector('.price-row.total span:last-child');

function updatePrice() {
  let price = 0;

  // Размер
  const size = document.querySelector('input[name="count"]:checked')?.parentNode.textContent;
  if (size?.includes('Бенто')) price += 1200;
  else if (size?.includes('Небольшой')) price += 2200;
  else if (size?.includes('Средний')) price += 3500;
  else if (size?.includes('Большой')) price += 4500;

  // Форма
  const shape = document.querySelector('input[name="shape"]:checked')?.parentNode.textContent;
  if (shape?.includes('Цифра') || shape?.includes('буква')) price += 400;
  else if (shape?.includes('Сердце')) price += 300;
  else if (shape?.includes('Другое')) price += 500;

  // Пропитка
  const soak = document.querySelector('input[name="soaking"]:checked')?.parentNode.textContent;
  if (soak && !soak.includes('Без')) price += 100;

  // Дизайн
  const design = document.querySelector('[data-layer="design"]').textContent;
  if (design.includes('Лёгкий')) price += 300;
  else if (design.includes('Сложный')) price += 800;
  else if (design.includes('Индивидуальный')) price += 1500;

  // Скидка
  let discount = 0; // пример фиксированной скидки, можно динамическую

  // Обновляем верстку
  const goodsRow = document.querySelector('.price-row:nth-child(2) span:last-child');
  const discountRow = document.querySelector('.price-row:nth-child(3) span:last-child');
  const totalRow = document.querySelector('.price-row.total span:last-child');

  if (goodsRow) goodsRow.textContent = price + ' ₽';
  if (discountRow) discountRow.textContent = discount + ' ₽';
  if (totalRow) totalRow.textContent = (price - discount) + ' ₽';
}


  // 🔥 Слушатели для опций
  document.querySelectorAll('input[name="count"], input[name="shape"], input[name="soaking"]').forEach(inp => {
    inp.addEventListener('change', updatePrice);
  });

  // Начальный расчёт
  updatePrice();
});
