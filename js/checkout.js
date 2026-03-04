document.addEventListener("DOMContentLoaded", () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const itemList = document.getElementById("checkout-items-list");
  const subtotalEl = document.getElementById("summary-subtotal");
  const totalEl = document.getElementById("summary-total");
  const shipEl = document.getElementById("summary-shipping");
  const shippingRadios = document.querySelectorAll('input[name="shipping"]');

  let subtotal = 0;

  cart.forEach((item) => {
    subtotal += item.price * item.qty;
    const div = document.createElement("div");
    div.className = "checkout-item";
    div.innerHTML = `
            <img src="${item.images[0]}" alt="${item.name}">
            <div class="checkout-item-info">
                <h4>${item.name}</h4>
                <p>Quantity: ${item.qty}</p>
            </div>
            <strong>$${(item.price * item.qty).toFixed(2)}</strong>
        `;
    itemList.appendChild(div);
  });

  const updateTotal = () => {
    const shipping = parseFloat(
      document.querySelector('input[name="shipping"]:checked').value,
    );
    subtotalEl.innerText = `$${subtotal.toFixed(2)}`;
    shipEl.innerText = `$${shipping.toFixed(2)}`;
    totalEl.innerText = `$${(subtotal + shipping).toFixed(2)}`;
  };

  shippingRadios.forEach((r) => r.addEventListener("change", updateTotal));
  updateTotal();

  document
    .getElementById("checkoutForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const token = localStorage.getItem("token");
      if (!token) return alert("Please Login First!");

      const orderData = {
        fullName: document.getElementById("cus_name").value,
        email: document.getElementById("cus_email").value,
        phone: document.getElementById("cus_phone").value,
        address: document.getElementById("cus_add1").value,
        products: cart,
        totalAmount: parseFloat(totalEl.innerText.replace("$", "")),
      };

      const res = await fetch(
        "https://beauty-zone-server-app.vercel.app/api/payment/init",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(orderData),
        },
      );

      const data = await res.json();
      if (data.url) window.location.href = data.url; // SSLCommerz Page
    });
});
