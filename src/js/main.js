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

// Array con TODOS los productos desde la API
let products = [];

// Array con los productos añadidos al carrito (subconjunto de products)
let cart = loadCartFromLocalStorage(); // Carga carrito guardado o array vacío

// -----------------------------
// FUNCIONES
// -----------------------------

/**
 * Carga productos desde la API y los guarda en 'products'.
 * Luego muestra todos los productos en la lista.
 */
function fetchProducts() {
  fetch('https://fakestoreapi.com/products')
    .then((response) => {
      if (!response.ok) throw new Error('Error al cargar productos');
      return response.json();
    })
    .then((data) => {
      products = [...data]; // Guardamos todos los productos
      renderClothes(products); // Pintamos la lista completa inicialmente
    })
    .catch((error) => {
      console.error(error);
      listContainer.innerHTML = '<p>Error al cargar productos.</p>';
    });
}

/**
 * Pinta en pantalla la lista de productos que recibe en el array 'items'.
 * Cada producto muestra imagen, título, precio y botón Comprar/Eliminar según esté en carrito.
 */
function renderClothes(items) {
  listContainer.innerHTML = '';

  if (items.length === 0) {
    listContainer.innerHTML = '<p>No se encontraron productos.</p>';
    return;
  }

  items.forEach((item) => {
    // Comprobar si el producto está en el carrito
    const isInCart = cart.some((product) => product.id === item.id);

    const card = document.createElement('div');
    card.classList.add('item');

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
 * Pinta en pantalla el carrito con tarjetas iguales a las de la lista.
 * Incluye botón “Eliminar todo” y botón “×” para eliminar producto individual.
 */
function renderCart() {
  cartContainer.innerHTML = '<h2>🛒 Carrito</h2>';

  if (cart.length === 0) {
    cartContainer.innerHTML += '<p>Tu carrito está vacío.</p>';
    return;
  }

  // Botón para vaciar todo el carrito
  cartContainer.innerHTML += `<button id="clear-cart" style="margin-bottom:10px;">Eliminar todo</button>`;

  // Contenedor para las tarjetas con estilo grid igual que la lista
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
 * Filtra los productos que contienen el texto buscado y muestra los resultados.
 */
function handleSearch() {
  const searchText = input.value.trim().toLowerCase();

  const filtered = products.filter((item) =>
    item.title.toLowerCase().includes(searchText)
  );

  renderClothes(filtered);
}

/**
 * Gestiona los clics en la página para añadir/quitar productos del carrito y vaciar carrito.
 */
function handleCartToggle(e) {
  // Añadir o quitar producto desde la lista de productos
  if (e.target.classList.contains('cart-button')) {
    const id = parseInt(e.target.dataset.id);
    const product = products.find((p) => p.id === id);
    const inCart = cart.some((item) => item.id === id);

    if (inCart) {
      // Quitar producto del carrito
      cart = cart.filter((item) => item.id !== id);
    } else {
      // Añadir producto al carrito
      cart.push(product);
    }

    saveCartToLocalStorage();
    renderClothes(products);
    renderCart();
  }

  // Eliminar producto individual del carrito con el botón "×"
  if (e.target.classList.contains('remove-item')) {
    const id = parseInt(e.target.dataset.id);
    cart = cart.filter((item) => item.id !== id);
    saveCartToLocalStorage();
    renderClothes(products);
    renderCart();
  }

  // Vaciar todo el carrito con botón "Eliminar todo"
  if (e.target.id === 'clear-cart') {
    cart = [];
    saveCartToLocalStorage();
    renderClothes(products);
    renderCart();
  }
}

/**
 * Guarda el array 'cart' en localStorage como JSON string.
 */
function saveCartToLocalStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

/**
 * Carga carrito desde localStorage o devuelve array vacío si no hay nada.
 */
function loadCartFromLocalStorage() {
  const stored = localStorage.getItem('cart');
  return stored ? JSON.parse(stored) : [];
}

// -----------------------------
// EVENTOS
// -----------------------------

// Buscar productos al hacer click en botón buscar
buttonSearch.addEventListener('click', handleSearch);

// Escuchar clicks para añadir/quitar productos y limpiar carrito
document.addEventListener('click', handleCartToggle);

// -----------------------------
// INICIO DE LA APP
// -----------------------------

fetchProducts();
renderCart();



