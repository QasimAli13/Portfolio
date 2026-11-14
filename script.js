/* ===== THEME ===== */
const darkModeBtn = document.getElementById("dark-mode-btn");
const body = document.body;
const THEME_KEY = "theme";

function applyTheme(isDark) {
  body.classList.toggle("dark-mode", isDark);
  body.classList.toggle("light-mode", !isDark);

  const icon = darkModeBtn?.querySelector("i");
  if (icon) {
    icon.className = isDark ? "fas fa-sun" : "fas fa-moon";
  }
}

// Dark is the default; light only if the visitor chose it before
applyTheme(localStorage.getItem(THEME_KEY) !== "light");

darkModeBtn?.addEventListener("click", () => {
  const isDark = !body.classList.contains("dark-mode");
  applyTheme(isDark);
  localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
});

/* ===== NAVBAR SCROLL STATE ===== */
const topbar = document.querySelector(".topbar");

window.addEventListener(
  "scroll",
  () => topbar?.classList.toggle("scrolled", window.scrollY > 20),
  { passive: true },
);

/* ===== MOBILE MENU ===== */
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

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

document.addEventListener("click", (event) => {
  if (!menu?.contains(event.target) && !hamburger?.contains(event.target)) {
    closeMenu();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 880) closeMenu();
});

/* ===== SCROLL REVEAL ===== */
const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && revealElements.length) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 },
  );

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  // Fallback: show everything if IntersectionObserver is unavailable
  revealElements.forEach((element) => element.classList.add("visible"));
}

/* ===== FOOTER YEAR ===== */
const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

/* ===== PROJECT HORIZONTAL SCROLL ===== */
(function projectHorizontalScroll() {
  const scroller = document.querySelector(".project-scroller");

  if (!scroller) return;

  scroller.addEventListener(
    "wheel",
    (event) => {
      if (event.shiftKey && Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
        event.preventDefault();
        scroller.scrollLeft += event.deltaY;
      }
    },
    { passive: false },
  );

  let isDragging = false;
  let startX = 0;
  let startScrollLeft = 0;
  let hasDragged = false;

  scroller.addEventListener("mousedown", (event) => {
    isDragging = true;
    hasDragged = false;
    scroller.style.cursor = "grabbing";

    // Snap and smooth scrolling fight with manual dragging, so pause them
    scroller.style.scrollSnapType = "none";
    scroller.style.scrollBehavior = "auto";

    startX = event.pageX - scroller.offsetLeft;
    startScrollLeft = scroller.scrollLeft;
  });

  const stopDragging = () => {
    if (!isDragging) return;

    isDragging = false;
    scroller.style.cursor = "";
    scroller.style.scrollSnapType = "";
    scroller.style.scrollBehavior = "";
  };

  scroller.addEventListener("mouseleave", stopDragging);
  window.addEventListener("mouseup", stopDragging);

  scroller.addEventListener("mousemove", (event) => {
    if (!isDragging) return;

    event.preventDefault();

    const currentX = event.pageX - scroller.offsetLeft;
    const dragDistance = (currentX - startX) * 1.5;

    if (Math.abs(dragDistance) > 6) {
      hasDragged = true;
    }

    scroller.scrollLeft = startScrollLeft - dragDistance;
  });

  // Stop the browser's native image/link dragging
  scroller.addEventListener("dragstart", (event) => event.preventDefault());

  // Don't follow a link if the user was dragging
  scroller.addEventListener(
    "click",
    (event) => {
      if (!hasDragged) return;

      const clickedLink = event.target.closest("a");

      if (clickedLink) {
        event.preventDefault();
        event.stopPropagation();
      }

      hasDragged = false;
    },
    true,
  );
})();

/* ===== CONTACT FORM ===== */
(function contactForm() {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");

  if (!form || !status) return;

  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (submitBtn) submitBtn.disabled = true;

    status.textContent = "Sending...";
    status.className = "form-status";

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    delete payload.botcheck;

    try {
      const response = await fetch(form.action, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        status.textContent = "Message sent successfully!";
        status.className = "form-status success";
        form.reset();
      } else {
        status.textContent = result.message || "Something went wrong.";
        status.className = "form-status error";
      }
    } catch (error) {
      status.textContent = "Network error. Please try again.";
      status.className = "form-status error";
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
})();
