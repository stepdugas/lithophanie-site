const stripe = Stripe("pk_live_51RhaxoEww7sCUoLO2LKbQTajW2LgjYyxAukYAkYRy83PxQfutBKchoVWRLlGnKDsyqlckg3OX1vkISvCseOfHoLi00Q0TQnmxo");

// --- CART LOGIC ---
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// --- ADD TO CART WITH PHOTO ---
function addProductWithPhoto(name, price, priceId, photoInputId) {
  const photoInput = document.getElementById(photoInputId);
  if (!photoInput || !photoInput.files[0]) {
    alert("Please upload a photo for this product before adding to cart.");
    return;
  }

  const photoName = photoInput.files[0].name; // store just filename
  const cart = getCart();
  const existing = cart.find(item => item.name === name && item.photo === photoName);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ name, price, priceId, quantity: 1, photo: photoName });
  }

  saveCart(cart);
  alert(`${name} added to cart with photo: ${photoName}`);
}

// --- RENDER CART ---
function renderCart() {
  const cartList = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");
  if (!cartList || !totalEl) return;

  const cart = getCart();
  cartList.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartList.innerHTML = `<tr><td colspan="5" style="text-align:center;">Your cart is empty.</td></tr>`;
    totalEl.textContent = "0.00";
    return;
  }

  cart.forEach((item, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.photo || 'No photo'}</td>
      <td>${item.quantity}</td>
      <td>$${(item.price * item.quantity).toFixed(2)}</td>
      <td><button class="remove-btn" onclick="removeItem(${index})">Remove</button></td>
    `;
    cartList.appendChild(row);
    total += item.price * item.quantity;
  });

  totalEl.textContent = total.toFixed(2);
}

// --- REMOVE ITEM ---
function removeItem(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderCart();
}

// --- STRIPE CHECKOUT ---
document.addEventListener("DOMContentLoaded", () => {
  renderCart();

  const checkoutBtn = document.getElementById("checkout-button");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      console.log("Checkout button clicked");
      const cart = getCart();
      console.log("Cart:", cart);

      if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
      }

      const lineItems = cart.map(item => ({
        price: item.priceId,
        quantity: item.quantity
      }));
      console.log("Stripe lineItems:", lineItems);

      stripe.redirectToCheckout({
        lineItems,
        mode: "payment",
        successUrl: window.location.origin + "/success.html",
        cancelUrl: window.location.origin + "/cancel.html"
      }).then(result => {
        if (result.error) {
          console.error("Stripe checkout error:", result.error);
          alert("Error: " + result.error.message);
        }
      });
    });
  }
});
