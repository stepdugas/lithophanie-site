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

    // Send order email via EmailJS
    await emailjs.sendForm("service_dtd8eds", "template_39za7zn", orderForm);

    // Save to localStorage cart
    const cart = getCart();
    cart.push({ name, email, product, color, quantity, price, colorPrice });
    saveCart(cart);

    // Redirect to cart page
    window.location.href = "cart.html";
  });
});
