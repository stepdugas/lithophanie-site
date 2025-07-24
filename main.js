// === SAMPLE IMAGE ANIMATION ===
document.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll(".samples-grid img");

  if (images.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal");
        }
      });
    }, { threshold: 0.2 });

    images.forEach(img => observer.observe(img));
  }
});

// === CART PAGE LOGIC ===
const stripe = Stripe("pk_live_51RhaxoEww7sCUoLO2LKbQTajW2LgjYyxAukYAkYRy83PxQfutBKchoVWRLlGnKDsyqlckg3OX1vkISvCseOfHoLi00Q0TQnmxo");

// Load and save cart
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Map products to Stripe price IDs
function getStripePriceId(product) {
  const priceMap = {
    "Regular Lithophane – 4x6": "price_1RnkYZEww7sCUoLOqoPDwc9x",
    "Regular Lithophane – 5x7": "price_1RnkZ2Eww7sCUoLO76QRCkhP",
    "LED Box Stand – 4x6": "price_1RnkXpEww7sCUoLOU8dsVQCf",
    "LED Box Stand – 5x7": "price_1RnkY8Eww7sCUoLOEoInHGO7"
  };
  return priceMap[product];
}

// Render cart items
function renderCart() {
  const cartList = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");
  if (!cartList || !totalEl) return;

  const cart = getCart();
  cartList.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${item.product}</strong><br>
      Quantity: ${item.quantity} – $${item.price.toFixed(2)} each 
      <button class="remove-btn" data-index="${index}">Remove</button>
      <hr>
    `;
    cartList.appendChild(li);
  });

  totalEl.textContent = total.toFixed(2);

  // Add "Remove" button functionality
  document.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const index = parseInt(e.target.getAttribute("data-index"));
      removeCartItem(index);
    });
  });
}

// Remove item from cart
function removeCartItem(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderCart();
}

// Handle checkout
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
        price: getStripePriceId(item.product),
        quantity: item.quantity
      }));

      stripe.redirectToCheckout({
        lineItems,
        mode: "payment",
        successUrl: "https://orderlithophaneprints.com/success.html",
        cancelUrl: "https://orderlithophaneprints.com/cart.html"
      }).then(result => {
        if (result.error) {
          alert(result.error.message);
        }
      });
    });
  }
});
