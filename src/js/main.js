'use strict';

const input = document.querySelector('.input-description');
const buttonSearch = document.querySelector('.buttonSearch');
const listContainer = document.querySelector('.container-list');
const cartContainer = document.querySelector('.container-cart');

let products = [];
let cart = loadCartFromLocalStorage();

function fetchProducts() {
  fetch('https://fakestoreapi.com/products')
    .then(response => {
      if (!response.ok) throw new Error('Error al cargar productos');
      return response.json();
    })
    .then(data => {
      products = [...data];
      renderClothes(products);
    })
    .catch(error => {
      console.error(error);
      listContainer.innerHTML = '<p>Error al cargar productos.</p>';
    });
}

function renderClothes(items) {
  listContainer.innerHTML = '';

  if (items.length === 0) {
    listContainer.innerHTML = '<p>No se encontraron productos.</p>';
    return;
  }

  items.forEach(item => {
    const isInCart = cart.some(product => product.id === item.id);
    const card = document.createElement('div');
    card.classList.add('item');

    if (isInCart) {
      card.classList.add('in-cart');
    }

    card.innerHTML = `
      <img src="${item.image}" alt="${item.title}" />
      <h3>${item.title}</h3>
      <p>${item.price} €</p>
      <button data-id="${item.id}" class="cart-button ${isInCart ? 'in-cart' : ''}">
        ${isInCart ? 'Eliminar' : 'Comprar'}
      </button>
    `;

    listContainer.appendChild(card);
  });
}

function renderCart() {
  cartContainer.innerHTML = '<h2>🛒 Carrito</h2>';

  if (cart.length === 0) {
    cartContainer.innerHTML += '<p>Tu carrito está vacío.</p>';
    return;
  }

  cartContainer.innerHTML += `<button class="clear-cart" style="margin-bottom:10px;">Eliminar todo</button>`;

  const cartItemsContainer = document.createElement('div');
  cartItemsContainer.style.display = 'grid';
  cartItemsContainer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(180px, 1fr))';
  cartItemsContainer.style.gap = '20px';

  cart.forEach(item => {
    const card = document.createElement('div');
    card.classList.add('item');

    card.innerHTML = `
      <img src="${item.image}" alt="${item.title}" />
      <h3>${item.title}</h3>
      <p>${item.price} €</p>
      <button class="remove-item" data-id="${item.id}" title="Eliminar producto">×</button>
    `;

    cartItemsContainer.appendChild(card);
  });

  cartContainer.appendChild(cartItemsContainer);
}

function handleSearch(event) {
  if (event) event.preventDefault();
  const searchText = input.value.trim().toLowerCase();
  const filtered = products.filter(item => item.title.toLowerCase().includes(searchText));
  renderClothes(filtered);
}

function handleCartToggle(e) {
  if (e.target.classList.contains('cart-button')) {
    const id = parseInt(e.target.dataset.id);
    const product = products.find(p => p.id === id);
    const inCart = cart.some(item => item.id === id);

    if (inCart) {
      cart = cart.filter(item => item.id !== id);
    } else {
      cart.push(product);
    }

    saveCartToLocalStorage();
    renderClothes(products);
    renderCart();
  }

  if (e.target.classList.contains('remove-item')) {
    const id = parseInt(e.target.dataset.id);
    cart = cart.filter(item => item.id !== id);

    saveCartToLocalStorage();
    renderClothes(products);
    renderCart();
  }

  if (e.target.classList.contains('clear-cart')) {
    cart = [];
    saveCartToLocalStorage();
    renderClothes(products);
    renderCart();
  }
}

function saveCartToLocalStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCartFromLocalStorage() {
  const stored = localStorage.getItem('cart');
  return stored ? JSON.parse(stored) : [];
}

buttonSearch.addEventListener('click', handleSearch);
document.addEventListener('click', handleCartToggle);

fetchProducts();
renderCart();



