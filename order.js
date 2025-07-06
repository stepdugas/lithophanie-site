const stripe = Stripe("pk_live_51RhaxoEww7sCUoLO2LKbQTajW2LgjYyxAukYAkYRy83PxQfutBKchoVWRLlGnKDsyqlckg3OX1vkISvCseOfHoLi00Q0TQnmxo");

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function removeFromCart(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  location.reload(); // refresh to update UI
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
  const cart = getCart();
  const cartContainer = document.getElementById("cart-container");
  const checkoutBtn = document.getElementById("checkout-button");

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty.</p>";
    checkoutBtn.style.display = "none";
    return;
  }

  cart.forEach((item, index) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "cart-item";
    itemDiv.innerHTML = `
      <strong>${item.product}</strong> – ${item.color ? "Color" : "Classic"}<br>
      Quantity: ${item.quantity}<br>
      <button onclick="removeFromCart(${index})">Remove</button>
      <hr>
    `;
    cartContainer.appendChild(itemDiv);
  });

  checkoutBtn.addEventListener("click", () => {
    const lineItems = cart.map(item => ({
      price: getStripePriceId(item.product, item.color),
      quantity: item.quantity
    }));

    stripe.redirectToCheckout({
      lineItems: lineItems,
      mode: "payment",
      successUrl: "https://stepdugas.github.io/lithophanie-site/success.html",
      cancelUrl: "https://stepdugas.github.io/lithophanie-site/order.html",
    }).then(result => {
      if (result.error) alert(result.error.message);
    });
  });
});
