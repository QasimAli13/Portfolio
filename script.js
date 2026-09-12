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
    isDark ? "Switch to light mode" : "Switch to dark mode",
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
  menu?.classList.remove("active");
  hamburger?.setAttribute("aria-expanded", "false");
  const icon = hamburger?.querySelector("i");
  if (icon) icon.className = "fas fa-bars";
}

hamburger?.addEventListener("click", () => {
  const isOpen = menu?.classList.contains("active");
  if (isOpen) {
    closeMenu();
  } else {
    menu?.classList.add("active");
    hamburger.setAttribute("aria-expanded", "true");
    const icon = hamburger.querySelector("i");
    if (icon) icon.className = "fas fa-xmark";
  }
});

document
  .querySelectorAll(".menu a")
  .forEach((link) => link.addEventListener("click", closeMenu));

document.addEventListener("click", (e) => {
  if (!menu?.classList.contains("active")) return;
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

/* ===== SCROLL REVEAL (SAFE) ===== */
/* Default: everything visible. Only elements with .reveal get animated. */
const revealEls = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && revealEls.length) {
  // First, add a safety net: if JS runs, hide them initially
  revealEls.forEach((el) => {
    // Only hide if they're not already in viewport
    const rect = el.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (!inView) {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
    }
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "";
          entry.target.style.transform = "";
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
  );

  revealEls.forEach((el) => io.observe(el));
}
/* If no IntersectionObserver, nothing hides — content stays visible. */
