let currentProduct = null;

document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  if (!productId) {
    window.location.href = "allProducts.html";
    return;
  }

  try {
    const response = await fetch(
      `https://beauty-zone-server-app.vercel.app/api/products/${productId}`,
    );
    const result = await response.json();

    if (result.status === "success") {
      currentProduct = result.data;
      renderMainProduct(currentProduct);

      const allRes = await fetch(
        `https://beauty-zone-server-app.vercel.app/api/products`,
      );
      const allResult = await allRes.json();

      if (allResult.status === "success") {
        const allProducts = allResult.data;

        const handPicked = [...allProducts]
          .sort(() => 0.5 - Math.random())
          .slice(0, 4);
        renderGrid(handPicked, "related-grid");

        const bestSellers = allProducts
          .filter((p) => p._id !== productId)
          .sort(() => 0.5 - Math.random())
          .slice(0, 4);
        renderGrid(bestSellers, "best-seller-grid");
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }

  const mainAddBtn = document.getElementById("addCartBtn");
  if (mainAddBtn) {
    mainAddBtn.addEventListener("click", () => {
      if (currentProduct) {
        const qty = parseInt(document.getElementById("qtyInput").value) || 1;
        addToCart(currentProduct, qty);
      }
    });
  }
});

window.addToCart = (product, qty = 1) => {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const exist = cart.find((p) => p._id === product._id);

  if (exist) {
    exist.qty += qty;
  } else {
    const productToAdd = { ...product, qty: qty };
    cart.push(productToAdd);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`${product.name} (Qty: ${qty}) added to cart!`);
};

function renderMainProduct(product) {
  document.getElementById("detName").innerText = product.name;
  document.getElementById("detPrice").innerText = `$${product.price}`;
  document.getElementById("detDesc").innerText =
    product.details || product.description;
  document.getElementById("straightUpText").innerText = product.STRAIGHT_UP;
  document.getElementById("lowdownText").innerText = product.THE_LOWDOWN;

  const mainImg = document.getElementById("mainImg");
  const thumbList = document.getElementById("thumbList");

  mainImg.src = product.images[0];
  thumbList.innerHTML = product.images
    .map(
      (img) =>
        `<img src="${img}" onclick="document.getElementById('mainImg').src='${img}'" class="thumb-item">`,
    )
    .join("");
}

function renderGrid(products, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = products
    .map(
      (p) => `
        <div class="product-card" onclick="location.href='productDetails.html?id=${p._id}'">
            <div style="position: relative;">
                <img src="${p.images[0]}" alt="${p.name}">
                <div class="image-overlay">
                    <button class="add-cart-btn" onclick='event.stopPropagation(); addToCart(${JSON.stringify(p).replace(/'/g, "&apos;")})'>
                        <i class="fa-solid fa-cart-shopping"></i> Add to Cart
                    </button>
                </div>
            </div>
            <p class="cat-tag">${p.category}</p>
            <h4 class="prod-name">${p.name}</h4>
            <p class="prod-price">$${p.price.toFixed(2)}</p>
            <div class="rating">
                <i class="fa-solid fa-star"></i> 4.9 <span>(157)</span>
            </div>
        </div>
    `,
    )
    .join("");
}

window.changeQty = (val) => {
  const input = document.getElementById("qtyInput");
  let curr = parseInt(input.value);
  if (curr + val >= 1) input.value = curr + val;
};
