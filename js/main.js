/* =========================================================
   main.js — features shared by every page
   1. Mobile menu toggle
   2. Light / dark theme switch (saved in localStorage)
   3. Scroll reveal animation (IntersectionObserver)
   4. Animated number counters on the home page
   5. Current year in the footer
   ========================================================= */

// ---------- 1. Mobile menu toggle ----------
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

menuToggle.addEventListener("click", () => {
  // classList.toggle returns true when the class was added
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", isOpen);
  menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  menuToggle.textContent = isOpen ? "✕" : "☰";
});

function closeMenu() {
  navLinks.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open menu");
  menuToggle.textContent = "☰";
}

// Close the menu after choosing a link, or when the screen becomes wide
navLinks.addEventListener("click", (event) => { if (event.target.closest("a")) closeMenu(); });
window.addEventListener("resize", () => { if (window.innerWidth > 680) closeMenu(); });

// ---------- 2. Theme switch ----------
const themeToggle = document.getElementById("theme-toggle");
const root = document.documentElement; // the <html> element

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  themeToggle.textContent = theme === "dark" ? "☀" : "☾";
  themeToggle.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
}

// Start from the saved choice, otherwise follow the operating system setting
let savedTheme = null;
try { savedTheme = localStorage.getItem("theme"); } catch (e) { /* storage blocked */ }
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
applyTheme(savedTheme || (prefersDark ? "dark" : "light"));

themeToggle.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(next);
  try { localStorage.setItem("theme", next); } catch (e) { /* storage blocked */ }
});

// ---------- 3. Scroll reveal ----------
// The observer tells us when an element enters the viewport,
// so we only animate it once the visitor scrolls to it.
// threshold 0 + a small rootMargin: tall blocks on phones still trigger
const revealObserver = "IntersectionObserver" in window
  ? new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target); // animate once only
        }
      });
    }, { threshold: 0, rootMargin: "0px 0px -40px 0px" })
  : null;

function observeReveals() {
  document.querySelectorAll(".reveal:not(.visible)").forEach((el) => {
    // Older browsers without IntersectionObserver just show everything
    if (revealObserver) revealObserver.observe(el); else el.classList.add("visible");
  });
}
observeReveals();

// ---------- 4. Number counters ----------
function animateCount(el) {
  const target = Number(el.dataset.count);
  const duration = 1200; // milliseconds
  const start = performance.now();

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out curve
    el.textContent = Math.round(target * eased).toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const counterObserver = !("IntersectionObserver" in window) ? null : new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      animateCount(entry.target);
      observer.unobserve(entry.target);
    }
  });
});
document.querySelectorAll("[data-count]").forEach((el) => {
  if (counterObserver) counterObserver.observe(el); else el.textContent = Number(el.dataset.count).toLocaleString();
});

// ---------- 5. Footer year ----------
document.getElementById("year").textContent = new Date().getFullYear();
