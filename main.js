// === SAMPLE IMAGE ANIMATION ===
document.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll(".samples-grid img");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal");
      }
    });
  }, {
    threshold: 0.2
  });

  images.forEach(img => observer.observe(img));
});

// === CART PAGE LOGIC ===
const stripe = Stripe("pk_live_51RhaxoEww7sCUoLO2LKbQTajW2LgjYyxAukYAkYRy83PxQfutBKchoVWRLlGnKDsyqlckg3OX1vkISvCseOfHoLi00Q0TQnmxo");

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function getStripePriceId(product, color) {
  const priceMap = {
    "Framed Print": {
      classic: "price_1RhvHxEww7sCUoLOG0ClrTvX",
      color: "price_1RhvLrEww7sCUoLOJpaR6ri8",
    },
    "Nightlight Print": {
      classic: "price_1RhvMZEww7sCUoLOMwoRtZbi",
      color: "price_1RhvNQEww7sCUoLOVcvRC4lG",
    },
    "Tea Light Stand": {
      classic: "price_1RhvP1Eww7sCUoLOC6OV6srR",
      color: "price_1RhvPXEww7sCUoLOCiR5lpRo",
    },
    "Box Lamp": {
      classic: "price_1RhvQEEww7sCUoLOM0j6PNs3",
      color: "price_1RhvQnEww7sCUoLOe92GDUUA",
    }
  };
  return priceMap[product][color ? "color" : "classic"];
}

document.addEventListener("DOMContentLoaded", () => {
  const cartList = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");
  const checkoutBtn = document.getElementById("checkout-button");

  // If we’re not on the cart page, don’t run this part
  if (!cartList || !totalEl || !checkoutBtn) return;

  const cart = getCart();
  let total = 0;

  cart.forEach((item, index) => {
    const itemTotal = (item.price + (item.color ? item.colorPrice : 0)) * item.quantity;
    total += itemTotal;

    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${item.product}</strong> – ${item.color ? "Color" : "Classic"}<br>
      Quantity: ${item.quantity}
      <hr>
    `;
    cartList.appendChild(li);
  });

  totalEl.textContent = total.toFixed(2);

  checkoutBtn.addEventListener("click", () => {
    const lineItems = cart.map(item => ({
      price: getStripePriceId(item.product, item.color),
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
});
