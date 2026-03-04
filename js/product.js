const fetchProducts = async () => {
  try {
    const response = await fetch(
      "https://beauty-zone-server-app.vercel.app/api/products",
    );
    const result = await response.json();

    if (result.status === "success" && result.data.length > 0) {
      const products = result.data;
      renderProducts(products.slice(0, 4), "bestsellers-container");
      const lastFourProducts = [...products].reverse().slice(0, 4);
      renderProducts(lastFourProducts, "new-arrive-container");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const renderProducts = (products, containerId) => {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

  products.forEach((product) => {
    const productHTML = `
      <div class="product-card" onclick="goToDetails('${product._id}')" style="cursor: pointer;">
        <div style="position:relative;">
          <img src="${product.images[0]}" alt="${product.name}">
          
          <div class="image-overlay">
            <button class="add-cart-btn" onclick='event.stopPropagation(); addToCart(${JSON.stringify(product).replace(/'/g, "&apos;")})'>
              <i class="fa-solid fa-cart-plus"></i> Add to Cart
            </button>
          </div>
        </div>
        
        <span class="cat-tag">${product.category || "Serums"}</span>
        <h3 class="prod-name">${product.name}</h3>
        <p class="prod-price">$${product.price}</p>
        <div class="rating">
          <i class="fa-solid fa-star" style="font-size: 10px; color: #000;"></i> 4.9 
          <span>(86)</span>
        </div>
      </div>
    `;
    container.innerHTML += productHTML;
  });
};

window.goToDetails = (id) => {
  window.location.href = `productDetails.html?id=${id}`;
};

const addToCart = (product) => {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const exist = cart.find((p) => p._id === product._id);
  if (exist) {
    exist.qty += 1;
  } else {
    product.qty = 1;
    cart.push(product);
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`${product.name} added to cart!`);
};

document.addEventListener("DOMContentLoaded", fetchProducts);
