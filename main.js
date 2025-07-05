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
  
  const stripe = Stripe("pk_live_51RhaxoEww7sCUoLO2LKbQTajW2LgjYyxAukYAkYRy83PxQfutBKchoVWRLlGnKDsyqlckg3OX1vkISvCseOfHoLi00Q0TQnmxo"); 

document.getElementById("checkout-button").addEventListener("click", () => {
  stripe.redirectToCheckout({
    lineItems: [
      { price: "price_1RhbB6Eww7sCUoLOp3DrEQcm", quantity: 1 }
    ],
    mode: "payment",
    successUrl: "https://stepdugas.github.io/lithophanie-site/success.html",
    cancelUrl: "https://stepdugas.github.io/lithophanie-site/cancel.html",
  }).then(function (result) {
    if (result.error) {
      alert(result.error.message);
    }
  });
});
