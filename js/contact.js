/* =========================================================
   contact.js — contact form validation
   Checks each field when the form is submitted and shows a
   message under any field that is wrong. With no server, a
   valid form opens the visitor's email app with the message
   filled in (a mailto: link).
   ========================================================= */

const contactForm = document.getElementById("contact-form");
const statusText = document.getElementById("form-status");
const messageBox = document.getElementById("message");
const charCount = document.getElementById("char-count");

// Live character counter
messageBox.addEventListener("input", () => {
  charCount.textContent = `${messageBox.value.length} / 500`;
});

// Each rule returns an error message, or "" when the value is fine
const rules = {
  name: (value) => value.length < 2 ? "Please enter your name." : "",
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "" : "Please enter a valid email address.",
  message: (value) => value.length < 10 ? "Your message should be at least 10 characters." : ""
};

function validateField(name) {
  const input = contactForm.elements[name];
  const error = rules[name](input.value.trim());
  contactForm.querySelector(`[data-error-for="${name}"]`).textContent = error;
  input.parentElement.classList.toggle("invalid", error !== "");
  return error === "";
}

// Re-check a field as soon as the visitor leaves it
Object.keys(rules).forEach((name) => {
  contactForm.elements[name].addEventListener("blur", () => validateField(name));
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  // Validate every field (map, not some, so all errors show at once)
  const results = Object.keys(rules).map(validateField);
  if (results.includes(false)) {
    statusText.className = "form-status";
    statusText.textContent = "Please fix the highlighted fields.";
    return;
  }

  const name = contactForm.elements.name.value.trim();
  const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
  const body = encodeURIComponent(`${messageBox.value.trim()}\n\n${name}\n${contactForm.elements.email.value.trim()}`);
  window.location.href = `mailto:akintolaadeyi@gmail.com?subject=${subject}&body=${body}`;

  statusText.className = "form-status ok";
  statusText.textContent = `Thanks, ${name}! Your email app should open with the message ready to send.`;
  contactForm.reset();
  charCount.textContent = "0 / 500";
});
