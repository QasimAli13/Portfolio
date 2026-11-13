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
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
  );

  revealEls.forEach((el) => io.observe(el));
}

/* ===== STICKY HEADER SHADOW ===== */
(function headerScroll() {
  const topbar = document.querySelector(".topbar");
  if (!topbar) return;
  const onScroll = () => {
    topbar.classList.toggle("scrolled", window.scrollY > 10);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();

/* ===== FOOTER YEAR ===== */
(function footerYear() {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();

/* ===== CONTACT FORM (Web3Forms) ===== */
(function contactForm() {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  if (!form || !status) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.textContent = "Sending...";
    status.className = "form-status";

    const data = new FormData(form);
    const json = Object.fromEntries(data.entries());

    try {
      const res = await fetch(form.action, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(json),
      });
      const result = await res.json();

      if (res.ok && result.success) {
        status.textContent = "Message sent. I'll get back to you soon.";
        status.className = "form-status success";
        form.reset();
      } else {
        status.textContent =
          result.message || "Something went wrong. Please try again.";
        status.className = "form-status error";
      }
    } catch (err) {
      status.textContent =
        "Network error. Please try again or email me directly.";
      status.className = "form-status error";
    }
  });
})();

/* ============ HERO PARTICLE CONSTELLATION ============ */
(function heroParticles() {
  const canvas = document.querySelector(".hero-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const shell = canvas.parentElement;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  let w = 0,
    h = 0,
    dpr = Math.min(window.devicePixelRatio || 1, 2);
  let particles = [];
  const mouse = { x: -9999, y: -9999, active: false };

  function resize() {
    const rect = shell.getBoundingClientRect();
    w = rect.width;
    h = rect.height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.max(40, Math.floor((w * h) / 16000));
    particles = new Array(count).fill(0).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 0.6,
    }));
  }

  const linkDist = 130;
  const mouseDist = 160;

  function draw() {
    ctx.clearRect(0, 0, w, h);

    for (let i = 0; i < particles.length; i++) {
      const a = particles[i];
      for (let j = i + 1; j < particles.length; j++) {
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d = Math.hypot(dx, dy);
        if (d < linkDist) {
          const alpha = (1 - d / linkDist) * 0.35;
          ctx.strokeStyle = "rgba(78, 168, 189, " + alpha + ")";
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    for (const p of particles) {
      ctx.beginPath();
      ctx.fillStyle = "rgba(201, 169, 97, 0.85)";
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function step() {
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;

      if (mouse.active) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < mouseDist * mouseDist) {
          const f = (1 - Math.sqrt(d2) / mouseDist) * 0.6;
          p.x += (dx / (Math.sqrt(d2) || 1)) * f;
          p.y += (dy / (Math.sqrt(d2) || 1)) * f;
        }
      }
    }

    draw();
    requestAnimationFrame(step);
  }

  shell.addEventListener("mousemove", (e) => {
    const r = shell.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
    mouse.active = true;
  });
  shell.addEventListener("mouseleave", () => {
    mouse.active = false;
    mouse.x = mouse.y = -9999;
  });

  window.addEventListener("resize", resize);
  resize();

  if (reduceMotion) {
    draw();
  } else {
    step();
  }
})();
/* ============ PROJECT HORIZONTAL SCROLL ============ */
(function projectHorizontalScroll() {
  const scroller = document.querySelector(".project-scroller");
  if (!scroller) return;

  // Shift + wheel → horizontal scroll (normal wheel → page scroll)
  scroller.addEventListener(
    "wheel",
    (e) => {
      if (e.shiftKey && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        scroller.scrollLeft += e.deltaY;
      }
      // else: do nothing — let page scroll vertically
    },
    { passive: false },
  );

  // Drag to scroll (desktop)
  let isDown = false;
  let startX = 0;
  let scrollStart = 0;
  let moved = false;

  scroller.addEventListener("mousedown", (e) => {
    isDown = true;
    moved = false;
    scroller.style.cursor = "grabbing";
    scroller.style.userSelect = "none";
    startX = e.pageX - scroller.offsetLeft;
    scrollStart = scroller.scrollLeft;
  });

  const stopDrag = () => {
    isDown = false;
    scroller.style.cursor = "";
    scroller.style.userSelect = "";
  };

  scroller.addEventListener("mouseleave", stopDrag);
  scroller.addEventListener("mouseup", stopDrag);

  scroller.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - scroller.offsetLeft;
    const walk = (x - startX) * 1.5;
    if (Math.abs(walk) > 4) moved = true;
    scroller.scrollLeft = scrollStart - walk;
  });

  // Prevent click on links if user was dragging
  scroller.addEventListener(
    "click",
    (e) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    },
    true,
  );

  // Touch swipe → horizontal (browser handles natively with overflow-x auto)
})();
