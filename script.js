const darkModeBtn = document.getElementById("dark-mode-btn");

darkModeBtn.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        darkModeBtn.textContent = "☀️";
    } else {
        darkModeBtn.textContent = "🌙";
    }
});


const heading = document.querySelector("h1");

if (heading) {
    heading.addEventListener("click", () => {
        const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
        heading.style.color = randomColor;
    })
}
