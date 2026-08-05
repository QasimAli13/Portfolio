const darkModeBtn = document.getElementById("dark-mode-btn");
const body = document.body;

darkModeBtn.addEventListener("click", () => {
  body.classList.toggle("dark-mode");
  const icon = darkModeBtn.querySelector("i");
  if (body.classList.contains("dark-mode")) {
    icon.className = "fas fa-sun";
  } else {
    icon.className = "fas fa-moon";
  }
});

const hamburger = document.getElementById("hamburger");
const menu = document.getElementById("menu");

hamburger.addEventListener("click", () => {
  menu.classList.toggle("active");
  const expanded = menu.classList.contains("active");
  hamburger.setAttribute("aria-expanded", expanded);
});

document.querySelectorAll(".menu a").forEach((link) => {
  link.addEventListener("click", () => {
    menu.classList.remove("active");
    hamburger.setAttribute("aria-expanded", "false");
  });
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});
