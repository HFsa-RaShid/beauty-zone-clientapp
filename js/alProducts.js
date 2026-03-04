let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
const itemsPerPage = 12;

const renderProducts = (products, containerId) => {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

  products.forEach((product) => {
    const productHTML = `
      <div class="product-card " onclick="goToDetails('${product._id}')" style="cursor: pointer;">
        <div style="position:relative;">
          <img src="${product.images[0]}" alt="${product.name}">
          <div class="image-overlay">
                <button class="add-cart-btn" onclick='addToCart(${JSON.stringify(product).replace(/'/g, "&apos;")})'>
              <i class="fa-solid fa-cart-plus"></i> Add to Cart
            </button>
          </div>
        </div>
        <span class="cat-tag">${product.category || "Serums"}</span>
        <h3 class="prod-name">${product.name}</h3>
        <p class="prod-price">$${product.price}</p>
        <div class="rating">4.9 <i class="fa-solid fa-star"></i> <span>(86)</span></div>
      </div>
    `;
    container.innerHTML += productHTML;
  });
};

window.goToDetails = (id) => {
  window.location.href = `productDetails.html?id=${id}`;
};

const renderPagination = () => {
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const pagContainer = document.getElementById("pagination");
  if (!pagContainer) return;

  pagContainer.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.innerText = i;
    btn.className = `pag-btn ${i === currentPage ? "active" : ""}`;
    btn.onclick = () => {
      currentPage = i;
      updateUI();
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    pagContainer.appendChild(btn);
  }
};

const updateUI = () => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const productsToShow = filteredProducts.slice(startIndex, endIndex);

  renderProducts(productsToShow, "all-products-grid");
  renderPagination();
};

const fetchAllProducts = async () => {
  try {
    const response = await fetch(
      "https://beauty-zone-server-app.vercel.app/api/products",
    );
    const result = await response.json();

    if (result.status === "success") {
      allProducts = result.data;
      filteredProducts = [...allProducts];
      updateUI();
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const activeBtn = document.querySelector(".filter-btn.active");
    if (activeBtn) activeBtn.classList.remove("active");
    btn.classList.add("active");

    const cat = btn.dataset.category;
    filteredProducts =
      cat === "all"
        ? allProducts
        : allProducts.filter(
            (p) => p.category.toLowerCase() === cat.toLowerCase(),
          );

    currentPage = 1;
    updateUI();
  });
});

const sortSelect = document.getElementById("sortSelect");
if (sortSelect) {
  sortSelect.addEventListener("change", (e) => {
    const val = e.target.value;
    if (val === "low") {
      filteredProducts.sort((a, b) => a.price - b.price);
    } else if (val === "high") {
      filteredProducts.sort((a, b) => b.price - a.price);
    }
    updateUI();
  });
}

window.addToCart = (product) => {
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

document.addEventListener("DOMContentLoaded", fetchAllProducts);
