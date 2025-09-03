const p=document.querySelector(".input-description"),f=document.querySelector(".buttonSearch"),l=document.querySelector(".container-list"),s=document.querySelector(".container-cart");let c=[],n=L();function m(){fetch("https://fakestoreapi.com/products").then(t=>{if(!t.ok)throw new Error("Error al cargar productos");return t.json()}).then(t=>{c=[...t],i(c)}).catch(t=>{console.error(t),l.innerHTML="<p>Error al cargar productos.</p>"})}function i(t){if(l.innerHTML="",t.length===0){l.innerHTML="<p>No se encontraron productos.</p>";return}t.forEach(r=>{const e=n.some(o=>o.id===r.id),a=document.createElement("div");a.classList.add("item"),e&&a.classList.add("in-cart"),a.innerHTML=`
      <img src="${r.image}" alt="${r.title}" />
      <h3>${r.title}</h3>
      <p>${r.price} €</p>
      <button data-id="${r.id}" class="cart-button ${e?"in-cart":""}">
        ${e?"Eliminar":"Comprar"}
      </button>
    `,l.appendChild(a)})}function d(){if(s.innerHTML="<h2>🛒 Carrito</h2>",n.length===0){s.innerHTML+="<p>Tu carrito está vacío.</p>";return}s.innerHTML+='<button class="clear-cart" style="margin-bottom:10px;">Eliminar todo</button>';const t=document.createElement("div");t.style.display="grid",t.style.gridTemplateColumns="repeat(auto-fill, minmax(180px, 1fr))",t.style.gap="20px",n.forEach(r=>{const e=document.createElement("div");e.classList.add("item"),e.innerHTML=`
      <img src="${r.image}" alt="${r.title}" />
      <h3>${r.title}</h3>
      <p>${r.price} €</p>
      <button class="remove-item" data-id="${r.id}" title="Eliminar producto">×</button>
    `,t.appendChild(e)}),s.appendChild(t)}function h(t){t&&t.preventDefault();const r=p.value.trim().toLowerCase(),e=c.filter(a=>a.title.toLowerCase().includes(r));i(e)}function g(t){if(t.target.classList.contains("cart-button")){const r=parseInt(t.target.dataset.id),e=c.find(o=>o.id===r);n.some(o=>o.id===r)?n=n.filter(o=>o.id!==r):n.push(e),u(),i(c),d()}if(t.target.classList.contains("remove-item")){const r=parseInt(t.target.dataset.id);n=n.filter(e=>e.id!==r),u(),i(c),d()}t.target.classList.contains("clear-cart")&&(n=[],u(),i(c),d())}function u(){localStorage.setItem("cart",JSON.stringify(n))}function L(){const t=localStorage.getItem("cart");return t?JSON.parse(t):[]}f.addEventListener("click",h);document.addEventListener("click",g);m();d();
//# sourceMappingURL=main.js.map
