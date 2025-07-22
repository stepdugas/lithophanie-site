emailjs.init("8IvXP0jnH2z1KWvaN");

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

document.addEventListener("DOMContentLoaded", () => {
  const orderForm = document.getElementById("order-form");

  orderForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const productVal = document.getElementById("product").value;
    const sizeVal = document.getElementById("size").value; // New dropdown for 4x6 or 5x7
    const color = document.getElementById("colorUpgrade")?.checked || false;
    const quantity = parseInt(document.getElementById("quantity").value);
    const imageFile = document.getElementById("imageUpload").files[0];

    // Map product values
    const productMap = {
      ledbox: "LED Box Stand",
      litho: "Regular Lithophane"
    };
    const product = productMap[productVal] + " – " + sizeVal;

    // Set static price logic
    let price = 0;
    if (productVal === "ledbox") {
      price = sizeVal === "4x6" ? 35 : 40;
    } else if (productVal === "litho") {
      price = sizeVal === "4x6" ? 20 : 25;
    }

    // Send order email via EmailJS
    await emailjs.sendForm("service_dtd8eds", "template_39za7zn", orderForm);

    // Save to localStorage cart
    const cart = getCart();
    cart.push({ name, email, product, color, quantity, price });
    saveCart(cart);

    // Redirect to cart page
    window.location.href = "cart.html";
  });
});
