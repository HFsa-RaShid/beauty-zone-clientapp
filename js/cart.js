const cartContainer = document.getElementById('cart-container');
const cartTotalEl = document.getElementById('cart-total');
const subtotalEl = document.getElementById('subtotal'); 
const shippingEl = document.getElementById('shipping'); 

let cart = JSON.parse(localStorage.getItem("cart")) || [];
const shippingFee = 5.99;

const renderCart = () => {
  if (!cartContainer) return;
  
  cartContainer.innerHTML = '';
  let subtotal = 0;

  if (cart.length === 0) {
    cartContainer.innerHTML = '<p style="padding: 20px;">Your cart is empty.</p>';
    updateSummary(0);
    return;
  }

  cart.forEach((product, index) => {
    const itemTotal = product.price * product.qty;
    subtotal += itemTotal;

    const item = document.createElement('div');
    item.className = 'cart-item';
    item.innerHTML = `
      <div class="item-info">
        <img src="${product.images[0]}" alt="${product.name}">
        <div class="item-details">
          <h3>${product.name}</h3>
          <p>Quantity: ${product.qty}</p>
          <div class="qty-controls">
            <button onclick="decreaseQty(${index})">-</button>
            <span>${product.qty}</span>
            <button onclick="increaseQty(${index})">+</button>
          </div>
        </div>
      </div>
      <div class="item-price-delete">
        <p class="price">$${product.price}</p>
        <i class="fa-solid fa-trash-can delete-icon" onclick="removeItem(${index})"></i>
      </div>
    `;
    cartContainer.appendChild(item);
  });

  updateSummary(subtotal);
};


const updateSummary = (subtotal) => {
  const total = subtotal > 0 ? subtotal + shippingFee : 0;
  
  if(document.getElementById('subtotal')) {
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
  }
  
  if(cartTotalEl) {
    cartTotalEl.textContent = `$${total.toFixed(2)}`;
  }
};

const increaseQty = (i) => {
  cart[i].qty += 1;
  saveAndRender();
};

const decreaseQty = (i) => {
  if (cart[i].qty > 1) {
    cart[i].qty -= 1;
  } else {
    removeItem(i);
    return;
  }
  saveAndRender();
};

const removeItem = (i) => {
  cart.splice(i, 1);
  saveAndRender();
};

const saveAndRender = () => {
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
};

const checkout = () => {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  alert("Proceeding to checkout...");
  // এখানে পেমেন্ট গেটওয়ে বা পরবর্তী পেজের লজিক হবে
};

document.addEventListener('DOMContentLoaded', renderCart);