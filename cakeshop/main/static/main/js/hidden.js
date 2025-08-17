document.addEventListener('DOMContentLoaded', () => {
  const orderButton = document.getElementById('order-button');
  const modal = document.getElementById('order-modal');
  const closeBtn = modal.querySelector('.close-btn');

  // открытие
  orderButton.addEventListener('click', () => {
    modal.classList.remove('hidden');
  });

  // закрытие по крестику
  closeBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  // закрытие по клику вне окна
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
    }
  });
});
