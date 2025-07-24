const stripe = Stripe("pk_live_51RhaxoEww7sCUoLO2LKbQTajW2LgjYyxAukYAkYRy83PxQfutBKchoVWRLlGnKDsyqlckg3OX1vkISvCseOfHoLi00Q0TQnmxo");

// --- CART LOGIC ---
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(name, price, priceId) {
  const cart = getCart();
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ name, price, priceId, quantity: 1 });
  }
  saveCart(cart);
  alert(`${name} added to cart!`);
}

// --- RENDER CART ---
function renderCart() {
  const cartList = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");
  if (!cartList || !totalEl) return;

  const cart = getCart();
  cartList.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.quantity} × ${item.name} – $${(item.price * item.quantity).toFixed(2)}
      <button onclick="removeItem(${index})">Remove</button>
    `;
    cartList.appendChild(li);
    total += item.price * item.quantity;
  });

  totalEl.textContent = total.toFixed(2);
}

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
      const cart = getCart();
      if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
      }
      const lineItems = cart.map(item => ({
        price: item.priceId,
        quantity: item.quantity
      }));
      stripe.redirectToCheckout({
        lineItems,
        mode: "payment",
        successUrl: window.location.origin + "/success.html",
        cancelUrl: window.location.origin + "/cart.html"
      });
    });
  }
});
