const dateInput = document.getElementById('date');

const today = new Date();
today.setHours(0,0,0,0); 

today.setDate(today.getDate() + 3);

const minDate = today.toISOString().split('T')[0];

dateInput.min = minDate;

const timeInput = document.getElementById('time');

timeInput.addEventListener('input', () => {
  const value = timeInput.value; // формат "HH:MM"
  if (value < '09:00') {
    timeInput.value = '09:00';
  } else if (value > '20:00') {
    timeInput.value = '20:00';
  }
});


document.addEventListener('DOMContentLoaded', () => {
  const itemPrice = 2000; // цена за штуку
  const discount = 200;   // общая скидка

  const selectedCardsContainer = document.querySelector('.left-side');
  const totalPriceEl = document.querySelector('.price-row:nth-of-type(1) span:last-child');
  const finalPriceEl = document.querySelector('.price-row.total span:last-child');

  function updateTotalPrices() {
    const allCards = document.querySelectorAll('.selected-card');
    let total = 0;

    allCards.forEach(card => {
      const quantity = parseInt(card.querySelector('.quantity').textContent, 10);
      total += quantity * itemPrice;
    });

    // если карточек нет — всё = 0
    if (allCards.length === 0) {
      totalPriceEl.textContent = `0 руб.`;
      finalPriceEl.textContent = `0 руб.`;
      return;
    }

    const final = Math.max(0, total - discount); // защита от отрицательной суммы
    totalPriceEl.textContent = `${total.toLocaleString('ru-RU')} руб.`;
    finalPriceEl.textContent = `${final.toLocaleString('ru-RU')} руб.`;
  }

  function addEventListenersToCard(card) {
    const incrementBtn = card.querySelector('.increment');
    const decrementBtn = card.querySelector('.decrement');
    const quantitySpan = card.querySelector('.quantity');
    const priceEl = card.querySelector('.price');
    const deleteBtn = card.querySelector('.delete-button');

    function updateCardPrice() {
      const quantity = parseInt(quantitySpan.textContent, 10);
      const total = quantity * itemPrice;
      priceEl.textContent = `${total.toLocaleString('ru-RU')} руб.`;
      updateTotalPrices();
    }

    incrementBtn.addEventListener('click', () => {
      let quantity = parseInt(quantitySpan.textContent, 10);
      quantity++;
      quantitySpan.textContent = quantity;
      updateCardPrice();
    });

    decrementBtn.addEventListener('click', () => {
      let quantity = parseInt(quantitySpan.textContent, 10);
      if (quantity > 1) {
        quantity--;
        quantitySpan.textContent = quantity;
        updateCardPrice();
      }
    });

    deleteBtn.addEventListener('click', () => {
      card.remove();
      updateTotalPrices();
    });

    updateCardPrice(); // начальное обновление
  }

  // Назначить обработчики всем карточкам при загрузке
  const allCards = document.querySelectorAll('.selected-card');
  allCards.forEach(card => addEventListenersToCard(card));

  updateTotalPrices(); // итоговая сумма при загрузке
});



