// Initialize Stripe and EmailJS
const stripe = Stripe("pk_live_51RhaxoEww7sCUoLO2LKbQTajW2LgjYyxAukYAkYRy83PxQfutBKchoVWRLlGnKDsyqlckg3OX1vkISvCseOfHoLi00Q0TQnmxo");
emailjs.init("8IvXP0jnH2z1KWvaN");

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
  location.reload();
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
  const cartList = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");
  const checkoutBtn = document.getElementById("checkout-button");
  const orderForm = document.getElementById("order-form");

  // Display cart
  let total = 0;
  cart.forEach((item, index) => {
    const itemTotal = (item.price + (item.color ? item.colorPrice : 0)) * item.quantity;
    total += itemTotal;

    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${item.product}</strong> – ${item.color ? "Color" : "Classic"}<br>
      Quantity: ${item.quantity}
      <button onclick="removeFromCart(${index})">Remove</button>
      <hr>
    `;
    cartList.appendChild(li);
  });
  totalEl.textContent = total.toFixed(2);

  // Add to cart
  orderForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const productVal = document.getElementById("product").value;
    const productMap = {
      frame: "Framed Print",
      nightlight: "Nightlight Print",
      tealight: "Tea Light Stand",
      box: "Box Lamp"
    };
    const product = productMap[productVal];
    const color = document.getElementById("colorUpgrade").checked;
    const quantity = parseInt(document.getElementById("quantity").value);
    const imageFile = document.getElementById("imageUpload").files[0];

    const price = parseFloat(document.querySelector(`#product option[value="${productVal}"]`).textContent.match(/\$(\d+\.\d+)/)[1]);
    const colorPrice = productVal === "box" ? 10 : 5;

    // EmailJS File Upload
    const formData = new FormData();
    formData.append("from_name", name);
    formData.append("from_email", email);
    formData.append("product", product);
    formData.append("colorUpgrade", color ? "Yes" : "No");
    formData.append("quantity", quantity);
    formData.append("file", imageFile);

    await emailjs.sendForm("service_dtd8eds", "template_39za7zn", orderForm);


    // Add to localStorage cart
    const cart = getCart();
    cart.push({ name, email, product, color, quantity, price, colorPrice });
    saveCart(cart);
    location.reload();
  });

  // Stripe Checkout
  checkoutBtn.addEventListener("click", () => {
    const lineItems = cart.map(item => ({
      price: getStripePriceId(item.product, item.color),
      quantity: item.quantity
    }));

    
   stripe.redirectToCheckout({
  lineItems,
  mode: "payment",
  successUrl: "https://orderlithophaneprints.com/success.html",
  cancelUrl: "https://orderlithophaneprints.com/order.html"
}).then(result => {
      if (result.error) alert(result.error.message);
    });
  });
});
