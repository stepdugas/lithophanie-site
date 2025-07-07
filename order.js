// Initialize Stripe and EmailJS
const stripe = Stripe("pk_live_51RhaxoEww7sCUoLO2LKbQTajW2LgjYyxAukYAkYRy83PxQfutBKchoVWRLlGnKDsyqlckg3OX1vkISvCseOfHoLi00Q0TQnmxo");
emailjs.init("8IvXP0jnH2z1KWvaN");

// Helpers for localStorage cart
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

  // Add to cart on form submit
  orderForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const productDropdown = document.getElementById("product");
    const product = productDropdown.options[productDropdown.selectedIndex].text.split(" – ")[0].trim();

    const color = document.getElementById("colorUpgrade").checked;
    const quantity = parseInt(document.getElementById("quantity").value);
    const imageInput = document.getElementById("imageUpload");
    const image = imageInput.files[0];

    if (!image) {
      alert("Please upload a photo.");
      return;
    }

    const price = parseFloat(productDropdown.options[productDropdown.selectedIndex].text.split("– $")[1]);
    const colorPrice = product === "Box Lamp" ? 10 : 5;

    const cart = getCart();
    cart.push({
      product,
      color,
      quantity,
      price,
      colorPrice,
      imageName: image.name // just for reference
    });
    saveCart(cart);
    alert("✅ Added to cart!");
    orderForm.reset();
  });

  // Display cart items
  if (cart.length === 0) {
    cartList.innerHTML = "<p>Your cart is empty.</p>";
    checkoutBtn.style.display = "none";
    return;
  }

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

  // Checkout button logic
  checkoutBtn.addEventListener("click", () => {
    const customerName = "Customer"; // Placeholder; could prompt or ask in form
    const customerEmail = "orders@lithoprints.com"; // Or leave blank if not collecting

    const lineItems = cart.map(item => ({
      price: getStripePriceId(item.product, item.color),
      quantity: item.quantity
    }));

    // Send email per item
    cart.forEach(item => {
      emailjs.send("service_dtd8eds", "template_39za7zn", {
        from_name: customerName,
        from_email: customerEmail,
        product: item.product,
        colorUpgrade: item.color ? "Yes" : "No",
        quantity: item.quantity
      }).then(res => {
        console.log("✅ Email sent!", res.status);
      }).catch(err => {
        console.error("❌ EmailJS error:", err);
      });
    });

    // Clear cart and redirect
    localStorage.removeItem("cart");
    stripe.redirectToCheckout({
      lineItems,
      mode: "payment",
      successUrl: "https://stepdugas.github.io/lithophanie-site/success.html",
      cancelUrl: "https://stepdugas.github.io/lithophanie-site/order.html"
    }).then(result => {
      if (result.error) alert(result.error.message);
    });
  });
});
