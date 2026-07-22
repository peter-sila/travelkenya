document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const subject = document.getElementById("subject").value.trim();
  const message = document.getElementById("message").value.trim();
  const status = document.getElementById("formStatus");

  if (!name || !email || !subject || !message) {
    status.style.color = "red";
    status.textContent = "Please fill in all required fields.";
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    status.style.color = "red";
    status.textContent = "Please enter a valid email address.";
    return;
  }

  // Simulate successful submission
  status.style.color = "green";
  status.textContent = "Message sent successfully! We'll get back to you shortly.";

  // Reset form
  document.getElementById("contactForm").reset();
});
