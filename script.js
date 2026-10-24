/* ===== THEME ===== */
const darkModeBtn = document.getElementById("dark-mode-btn");
const body = document.body;
const THEME_KEY = "theme";

function applyTheme(isDark) {
  body.classList.toggle("dark-mode", isDark);
  const icon = darkModeBtn?.querySelector("i");
  if (icon) icon.className = isDark ? "fas fa-sun" : "fas fa-moon";
  darkModeBtn?.setAttribute(
    "aria-label",
    isDark ? "Switch to light mode" : "Switch to dark mode"
  );
}

applyTheme(localStorage.getItem(THEME_KEY) === "dark");

darkModeBtn?.addEventListener("click", () => {
  const isDark = !body.classList.contains("dark-mode");
  applyTheme(isDark);
  localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
});

/* ===== MENU ===== */
const hamburger = document.getElementById("hamburger");
const menu = document.getElementById("menu");

function closeMenu() {
  menu?.classList.remove("menu-open");
  hamburger?.setAttribute("aria-expanded", "false");
  const icon = hamburger?.querySelector("i");
  if (icon) icon.className = "fas fa-bars";
}

hamburger?.addEventListener("click", () => {
  const isOpen = menu?.classList.contains("menu-open");
  if (isOpen) {
    closeMenu();
  } else {
    menu?.classList.add("menu-open");
    hamburger.setAttribute("aria-expanded", "true");
    const icon = hamburger.querySelector("i");
    if (icon) icon.className = "fas fa-xmark";
  }
});

document.querySelectorAll(".menu a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("click", (e) => {
  if (!menu?.classList.contains("menu-open")) return;
  if (menu.contains(e.target) || hamburger?.contains(e.target)) return;
  closeMenu();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMenu();
});

/* ===== SMOOTH SCROLL ===== */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (!href || href === "#") return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    history.pushState(null, "", href);
  });
});

/* ===== SCROLL REVEAL ===== */
const revealEls = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && revealEls.length) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );

  revealEls.forEach((el) => io.observe(el));
}