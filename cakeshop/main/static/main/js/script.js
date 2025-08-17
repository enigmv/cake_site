document.addEventListener("DOMContentLoaded", function () {
  const dropdown = document.querySelector(".dropdown");
  const button = document.querySelector(".dropbtn");
  const options = dropdown.querySelectorAll(".dropdown-content a");

  button.addEventListener("click", function () {
    dropdown.classList.toggle("open");
  });

  options.forEach(option => {
    option.addEventListener("click", function (e) {
      e.preventDefault();

      const newText = this.textContent;
      const sortType = this.dataset.sort;

      // Меняем текст кнопки, оставляя стрелку
      // Здесь у кнопки первый childNode — текст, второй — span.arrow
      button.childNodes[0].textContent = newText + " ";

      // Закрываем выпадашку
      dropdown.classList.remove("open");

      // Запускаем сортировку
      sortCards(sortType);
    });
  });

  // Закрывать выпадашку при клике вне её
  window.addEventListener("click", function (e) {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove("open");
    }
  });

  function sortCards(type) {
    const container = document.querySelector(".catalog1");
    const cards = Array.from(container.querySelectorAll(".card1"));

    cards.sort((a, b) => {
      const priceA = parseFloat(a.dataset.price || 0);
      const priceB = parseFloat(b.dataset.price || 0);
      const popA = parseInt(a.dataset.popularity || 0);
      const popB = parseInt(b.dataset.popularity || 0);

      if (type === "cheap") return priceA - priceB;
      if (type === "expensive") return priceB - priceA;
      if (type === "popular") return popB - popA;
      return 0; // default — без сортировки
    });

    cards.forEach(card => container.appendChild(card));
  }
});












document.querySelectorAll('.add-btn').forEach(button => {
  button.addEventListener('click', () => {
    const cardFooter = button.closest('.card-footer');
    const qtyWrapper = cardFooter.querySelector('.quantity-wrapper');

    button.style.display = 'none';
    qtyWrapper.classList.remove('hidden');

    const quantityDisplay = qtyWrapper.querySelector('.quantity');
    let quantity = 1;
    quantityDisplay.textContent = quantity;

    const incrementBtn = qtyWrapper.querySelector('.increment');
    const decrementBtn = qtyWrapper.querySelector('.decrement');

    incrementBtn.onclick = () => {
        if (quantity < 10){
            quantity++;
            quantityDisplay.textContent = quantity;
        } else {}
    };

    decrementBtn.onclick = () => {
      if (quantity > 1) {
        quantity--;
        quantityDisplay.textContent = quantity;
      } else {
        // При достижении 1 и нажатии "-", возвращаем кнопку "Добавить"
        qtyWrapper.classList.add('hidden');
        button.style.display = 'inline-block';
      }
    };
  });
});


