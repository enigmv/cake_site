// basket-button.js (заменить файл целиком)
function getCookie(name) {
  const matches = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
  return matches ? decodeURIComponent(matches.pop()) : '';
}

document.addEventListener("DOMContentLoaded", () => {
  const discount = 200;
  const totalPriceEl = document.querySelector('.price-row:nth-of-type(1) span:last-child');
  const finalPriceEl = document.querySelector('.price-row.total span:last-child');

  async function postJson(url, body = null) {
    const headers = {
      'X-CSRFToken': getCookie('csrftoken'),
      'X-Requested-With': 'XMLHttpRequest'
    };
    const options = { method: 'POST', headers };

    if (body !== null) {
      headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(body);
    }

    const res = await fetch(url, options);
    const text = await res.text();

    try {
      return JSON.parse(text);
    } catch (e) {
      console.error('Expected JSON response from', url, 'received:', text.slice(0, 400));
      return null;
    }
  }

  async function updateCart(itemId, action) {
    return postJson(`/cakes/cart-update/${itemId}/${action}/`);
  }

  async function addToCart(cakeId) {
    return postJson(`/cakes/add-to-cart/${cakeId}/`);
  }

  async function deleteItem(itemId) {
    return postJson(`/cakes/cart-delete/${itemId}/`);
  }


  function updateTotalPrices() {
    const cards = document.querySelectorAll('.selected-card');
    let total = 0;
    cards.forEach(card => {
      const qty = parseInt(card.querySelector('.quantity').textContent, 10) || 0;
      const unit = parseFloat(card.dataset.unitPrice) || 0;
      total += qty * unit;
    });

    totalPriceEl.textContent = `${Math.round(total).toLocaleString('ru-RU')} руб.`;
    finalPriceEl.textContent = `${Math.round(Math.max(0, total - discount)).toLocaleString('ru-RU')} руб.`;
  }


  function syncCatalogQuantityByItemId(itemId, quantity) {
    if (!itemId) return;
    const card = document.querySelector('.card1[data-item-id="' + itemId + '"]');
    if (!card) return;
    const addBtn = card.querySelector('.add-btn');
    const qtyWrapper = card.querySelector('.quantity-wrapper');
    const cartIconBtn = card.querySelector('.cart-icon-button');
    const qtyEl = card.querySelector('.quantity');

    if (quantity > 0) {
      if (addBtn) addBtn.classList.add('hidden');
      if (qtyWrapper) qtyWrapper.classList.remove('hidden');
      if (cartIconBtn) cartIconBtn.classList.remove('hidden');
      if (qtyEl) qtyEl.textContent = quantity;
    } else {
      if (addBtn) addBtn.classList.remove('hidden');
      if (qtyWrapper) qtyWrapper.classList.add('hidden');
      if (cartIconBtn) cartIconBtn.classList.add('hidden');
      if (qtyEl) qtyEl.textContent = 0;
      // также очищаем data-item-id
      card.removeAttribute('data-item-id');
    }
  }


  function syncCatalogQuantityByCakeId(cakeId, quantity, itemId) {
    const card = document.querySelector('.card1[data-cake-id="' + cakeId + '"]');
    if (!card) return;
    if (itemId) {
      card.setAttribute('data-item-id', itemId);
    }
    const addBtn = card.querySelector('.add-btn');
    const qtyWrapper = card.querySelector('.quantity-wrapper');
    const cartIconBtn = card.querySelector('.cart-icon-button');
    const qtyEl = card.querySelector('.quantity');

    if (quantity > 0) {
      if (addBtn) addBtn.classList.add('hidden');
      if (qtyWrapper) qtyWrapper.classList.remove('hidden');
      if (cartIconBtn) cartIconBtn.classList.remove('hidden');
      if (qtyEl) qtyEl.textContent = quantity;
    } else {
      if (addBtn) addBtn.classList.remove('hidden');
      if (qtyWrapper) qtyWrapper.classList.add('hidden');
      if (cartIconBtn) cartIconBtn.classList.add('hidden');
      if (qtyEl) qtyEl.textContent = 0;
      card.removeAttribute('data-item-id');
    }
  }


  function attachCartHandlers(card) {
    const inc = card.querySelector('.increment');
    const dec = card.querySelector('.decrement');
    const qtyEl = card.querySelector('.quantity');
    const priceEl = card.querySelector('.price');
    const itemId = card.dataset.itemId;

    if (inc) inc.addEventListener('click', async (e) => {
      e.preventDefault();
      const data = await updateCart(itemId, 'increment');
      if (!data) return;
      qtyEl.textContent = data.quantity;
      priceEl.textContent = `${Math.round(data.total_price)} руб.`;
      updateTotalPrices();
      syncCatalogQuantityByItemId(itemId, data.quantity);
    });

    if (dec) dec.addEventListener('click', async (e) => {
      e.preventDefault();
      const data = await updateCart(itemId, 'decrement');
      if (!data) return;
      qtyEl.textContent = data.quantity;
      priceEl.textContent = `${Math.round(data.total_price)} руб.`;
      updateTotalPrices();
      syncCatalogQuantityByItemId(itemId, data.quantity);
    });

    const delBtn = card.querySelector('.delete-button');
    if (delBtn) delBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const data = await deleteItem(itemId);
      if (!data) return;
      if (data.success) {
        card.remove();
        updateTotalPrices();

        syncCatalogQuantityByItemId(itemId, 0);
        finalPriceEl.textContent = `${Math.round(data.cart_total)} руб.`;
      }
    });
  }


  function attachCatalogHandlers(card) {
    const addBtn = card.querySelector(".add-btn");
    const qtyWrapper = card.querySelector(".quantity-wrapper");
    const cartIconBtn = card.querySelector(".cart-icon-button");
    const qtyEl = card.querySelector(".quantity");
    const inc = card.querySelector(".increment");
    const dec = card.querySelector(".decrement");
    const cakeId = card.dataset.cakeId;

    if (addBtn) addBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      const data = await addToCart(cakeId);
      if (!data) return;
      if (data.item_id) card.setAttribute('data-item-id', data.item_id);
      if (addBtn) addBtn.classList.add("hidden");
      if (qtyWrapper) qtyWrapper.classList.remove("hidden");
      if (cartIconBtn) cartIconBtn.classList.remove("hidden");
      if (qtyEl) qtyEl.textContent = data.quantity;
      if (data.item_id) syncCatalogQuantityByItemId(data.item_id, data.quantity);
    });

    if (inc) inc.addEventListener("click", async (e) => {
      e.preventDefault();
      const itemId = card.dataset.itemId;
      if (!itemId) {
        const added = await addToCart(cakeId);
        if (!added) return;
        if (added.item_id) card.setAttribute('data-item-id', added.item_id);
        if (qtyEl) qtyEl.textContent = added.quantity;
        return;
      }
      const data = await updateCart(itemId, "increment");
      if (!data) return;
      if (qtyEl) qtyEl.textContent = data.quantity;
      syncCatalogQuantityByItemId(itemId, data.quantity);
    });

    if (dec) dec.addEventListener("click", async (e) => {
      e.preventDefault();
      const itemId = card.dataset.itemId;
      if (!itemId) return;
      const data = await updateCart(itemId, "decrement");
      if (!data) return;
      if (qtyEl) qtyEl.textContent = data.quantity;
      syncCatalogQuantityByItemId(itemId, data.quantity);
    });
  }

  document.querySelectorAll(".selected-card").forEach(attachCartHandlers);
  document.querySelectorAll(".card1").forEach(attachCatalogHandlers);

  updateTotalPrices();
});
