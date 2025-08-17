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
                img.src = `images/boxes/${newClass}.png`;
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
              img.src = `images/boxes/${newClass}.png`;
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
