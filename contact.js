document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  const responseMsg = document.getElementById("form-response");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    emailjs.sendForm("service_dtd8eds", "template_0e0h3dh", this)
      .then(function () {
        responseMsg.textContent = "✅ Message sent successfully!";
        responseMsg.style.color = "green";
        form.reset();
      }, function (error) {
        console.error("EmailJS Error:", error);
        responseMsg.textContent = "❌ There was an error sending your message. Please try again.";
        responseMsg.style.color = "red";
      });
  });
});
