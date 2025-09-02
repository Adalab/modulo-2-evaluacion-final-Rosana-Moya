'use strict';

console.log('>> Ready :)');

// 🔗 Elementos del DOM que usaremos
const input = document.querySelector('.input-description');
const buttonSearch = document.querySelector('.buttonSearch');
const listContainer = document.querySelector('.container-list');
const cartContainer = document.querySelector('.container-cart');

// 🧠 Estado de la aplicación: productos y carrito
let products = []; // Array con productos desde la API
let cart = loadCartFromLocalStorage(); // Array con productos del carrito guardados en localStorage

// 🔄 Función para cargar productos desde la API usando fetch y promesas (.then)
function fetchProducts() {
  fetch('https://fakestoreapi.com/products')
    .then((response) => {
      if (!response.ok) throw new Error('Error en la carga de productos');
      return response.json();
    })
    .then((data) => {
      products = [...data]; // Guardar productos en el array
      renderClothes(products); // Mostrar todos los productos inicialmente
    })
    .catch((error) => {
      console.error(error);
      listContainer.innerHTML = '<p>Error al cargar productos.</p>';
    });
}

// 🧱 Función para mostrar productos en la lista (resultado de búsqueda o todos)
function renderClothes(items) {
  listContainer.innerHTML = '';

  if (items.length === 0) {
    listContainer.innerHTML = '<p>No se encontraron productos.</p>';
    return;
  }

  items.forEach((item) => {
    // Comprobar si el producto ya está en el carrito para cambiar botón
    const isInCart = cart.some((product) => product.id === item.id);

    const card = document.createElement('div');
    card.classList.add('item');

    // Crear tarjeta con imagen, título, precio y botón comprar/eliminar
    card.innerHTML = `
      <img src="${item.image}" alt="${item.title}" width="100" />
      <h3>${item.title}</h3>
      <p>${item.price} €</p>
      <button data-id="${item.id}" class="cart-button ${isInCart ? 'in-cart' : ''}">
        ${isInCart ? 'Eliminar' : 'Comprar'}
      </button>
    `;

    listContainer.appendChild(card);
  });
}

// 🛒 Función para mostrar el carrito con productos añadidos
function renderCart() {
  cartContainer.innerHTML = '<h2>🛒 Carrito</h2>';

  // Si el carrito está vacío, mostramos mensaje y salimos
  if (cart.length === 0) {
    cartContainer.innerHTML += '<p>Tu carrito está vacío.</p>';
    return;
  }

  // Botón para vaciar todo el carrito
  cartContainer.innerHTML += `<button id="clear-cart" style="margin-bottom:10px;">Eliminar todo</button>`;

  // Mostrar cada producto del carrito con imagen, título, precio y botón para eliminarlo individualmente
  cart.forEach((item) => {
    const productHTML = `
      <div class="cart-item" style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
        <img src="${item.image}" alt="${item.title}" width="40" />
        <span>${item.title} - ${item.price}€</span>
        <button class="remove-item" data-id="${item.id}">❌</button>
      </div>
    `;
    cartContainer.innerHTML += productHTML;
  });
}

// 🔍 Función para filtrar productos según texto introducido en el buscador
function handleSearch() {
  const searchText = input.value.trim().toLowerCase();

  // Filtrar productos por título que contenga el texto
  const filtered = products.filter((item) =>
    item.title.toLowerCase().includes(searchText)
  );

  // Mostrar resultados filtrados
  renderClothes(filtered);
}

// ➕➖ Función que maneja añadir o eliminar productos del carrito, también eliminar uno solo y vaciar todo
function handleCartToggle(e) {
  // Si se pulsa un botón "Comprar"/"Eliminar" en el listado de productos
  if (e.target.classList.contains('cart-button')) {
    const id = parseInt(e.target.dataset.id);
    const product = products.find((p) => p.id === id);
    const inCart = cart.some((item) => item.id === id);

    if (inCart) {
      // Si ya está en carrito, eliminarlo
      cart = cart.filter((item) => item.id !== id);
    } else {
      // Si no está, añadirlo
      cart.push(product);
    }

    saveCartToLocalStorage(); // Guardar cambios
    renderClothes(products);  // Actualizar botones
    renderCart();             // Actualizar carrito
  }

  // Si se pulsa el botón "❌" para eliminar un producto individual del carrito
  if (e.target.classList.contains('remove-item')) {
    const id = parseInt(e.target.dataset.id);
    cart = cart.filter((item) => item.id !== id);
    saveCartToLocalStorage();
    renderClothes(products);
    renderCart();
  }

  // Si se pulsa el botón "Eliminar todo" para vaciar el carrito entero
  if (e.target.id === 'clear-cart') {
    cart = [];
    saveCartToLocalStorage();
    renderClothes(products);
    renderCart();
  }
}

// 💾 Guardar carrito en localStorage (como string JSON)
function saveCartToLocalStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// 📤 Cargar carrito desde localStorage y devolver array (si no hay nada devuelve array vacío)
function loadCartFromLocalStorage() {
  const stored = localStorage.getItem('cart');
  return stored ? JSON.parse(stored) : [];
}

// 📌 Añadir event listeners a botones y elementos
buttonSearch.addEventListener('click', handleSearch);
document.addEventListener('click', handleCartToggle); // Delegación para todos los botones dinámicos

// 🚀 Iniciar aplicación cargando productos y mostrando carrito guardado
fetchProducts();
renderCart();
