document.addEventListener("DOMContentLoaded", () => {
  // Intersection animation for sample images
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
