'use strict';

// -----------------------------
// ELEMENTOS DEL DOM
// -----------------------------
const input = document.querySelector('.input-description');
const buttonSearch = document.querySelector('.buttonSearch');
const listContainer = document.querySelector('.container-list');
const cartContainer = document.querySelector('.container-cart');

// -----------------------------
// VARIABLES DE ESTADO
// -----------------------------

let products = [];                         // Array con TODOS los productos de la API
let cart = loadCartFromLocalStorage();     // Carga carrito desde localStorage si existe

// -----------------------------
// FUNCIONES PRINCIPALES
// -----------------------------

/**
 * Carga productos desde la API y los guarda en la variable 'products'.
 * Luego los renderiza en pantalla.
 */
function fetchProducts() {
  fetch('https://fakestoreapi.com/products')
    .then((response) => {
      if (!response.ok) throw new Error('Error al cargar productos');
      return response.json();
    })
    .then((data) => {
      products = [...data];      // Guardamos todos los productos
      renderClothes(products);   // Mostramos todos los productos al cargar
    })
    .catch((error) => {
      console.error(error);
      listContainer.innerHTML = '<p>Error al cargar productos.</p>';
    });
}

/**
 * Renderiza una lista de productos en pantalla.
 * @param {Array} items - Array de productos a mostrar
 */
function renderClothes(items) {
  listContainer.innerHTML = ''; // Limpiar resultados anteriores

  if (items.length === 0) {
    listContainer.innerHTML = '<p>No se encontraron productos.</p>';
    return;
  }

  items.forEach((item) => {
    const isInCart = cart.some((product) => product.id === item.id);

    const card = document.createElement('div');
    card.classList.add('item');

    // Añadir clase 'in-cart' si ya está en el carrito
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

/**
 * Renderiza el contenido del carrito en pantalla.
 */
function renderCart() {
  cartContainer.innerHTML = '<h2>🛒 Carrito</h2>';

  if (cart.length === 0) {
    cartContainer.innerHTML += '<p>Tu carrito está vacío.</p>';
    return;
  }

  // Botón para vaciar todo el carrito (cambiado a clase)
  cartContainer.innerHTML += `
    <button class="clear-cart" style="margin-bottom:10px;">Eliminar todo</button>
  `;

  const cartItemsContainer = document.createElement('div');
  cartItemsContainer.style.display = 'grid';
  cartItemsContainer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(180px, 1fr))';
  cartItemsContainer.style.gap = '20px';

  cart.forEach((item) => {
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

/**
 * Filtra los productos según el texto ingresado en el input.
 */
function handleSearch() {
  const searchText = input.value.trim().toLowerCase();

  const filtered = products.filter((item) =>
    item.title.toLowerCase().includes(searchText)
  );

  renderClothes(filtered);
}

/**
 * Gestiona clics en botones de compra/eliminación y vaciar carrito.
 * Funciona usando delegación de eventos desde el document.
 */
function handleCartToggle(e) {
  // 1. Añadir o quitar producto desde el listado principal
  if (e.target.classList.contains('cart-button')) {
    const id = parseInt(e.target.dataset.id);
    const product = products.find((p) => p.id === id);
    const inCart = cart.some((item) => item.id === id);

    if (inCart) {
      cart = cart.filter((item) => item.id !== id); // Eliminar del carrito
    } else {
      cart.push(product); // Añadir al carrito
    }

    saveCartToLocalStorage();
    renderClothes(products);
    renderCart();
  }

  // 2. Eliminar producto individual desde el carrito
  if (e.target.classList.contains('remove-item')) {
    const id = parseInt(e.target.dataset.id);
    cart = cart.filter((item) => item.id !== id);

    saveCartToLocalStorage();
    renderClothes(products);
    renderCart();
  }

  // 3. Vaciar todo el carrito
  if (e.target.classList.contains('clear-cart')) {
    cart = [];
    saveCartToLocalStorage();
    renderClothes(products);
    renderCart();
  }
}

/**
 * Guarda el carrito actual en localStorage como string JSON.
 */
function saveCartToLocalStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

/**
 * Recupera el carrito desde localStorage.
 * Si no existe, devuelve un array vacío.
 */
function loadCartFromLocalStorage() {
  const stored = localStorage.getItem('cart');
  return stored ? JSON.parse(stored) : [];
}

// -----------------------------
// EVENTOS
// -----------------------------

// Buscar productos al hacer clic en el botón
buttonSearch.addEventListener('click', handleSearch);

// Escuchar clics globales para manejar carrito (botones dentro del DOM generado)
document.addEventListener('click', handleCartToggle);

// -----------------------------
// INICIO DE LA APP
// -----------------------------

fetchProducts();  // Cargar productos de la API
renderCart();     // Pintar el carrito (si hay productos en localStorage)




