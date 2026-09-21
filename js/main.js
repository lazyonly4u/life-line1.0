const contentEl = document.getElementById("content");
const navLinks = document.querySelectorAll(".nav-link");
const seasonSelect = document.getElementById("season-select");
const modeToggle = document.getElementById("mode-toggle");
const html = document.documentElement;

// ---- Section loading ----
// Each topic lives in its own file under /sections.
async function loadSection(name) {
  try {
    const res = await fetch(`sections/${name}.html`);
    if (!res.ok) throw new Error(`Missing section: ${name}`);
    contentEl.innerHTML = await res.text();
  } catch (err) {
    contentEl.innerHTML = `<div class="card"><h2>Couldn't load that section</h2><p>${err.message}</p></div>`;
  }

  navLinks.forEach(link => {
    link.classList.toggle("active", link.dataset.section === name);
  });
}

navLinks.forEach(link => {
  link.addEventListener("click", () => loadSection(link.dataset.section));
});

// ---- Theme switching ----
// No duplicated markup per season — just flip an attribute.
seasonSelect.addEventListener("change", () => {
  html.setAttribute("data-season", seasonSelect.value);
});

// Toggle light/dark mode with a button, not a select, for accessibility.
modeToggle.addEventListener("click", () => {
  const isDark = html.getAttribute("data-mode") === "dark";
  html.setAttribute("data-mode", isDark ? "light" : "dark");
  modeToggle.textContent = isDark ? "🌙 Dark mode" : "☀️ Light mode";
  modeToggle.setAttribute("aria-pressed", String(!isDark));
});

// ---- Initial load ----
loadSection("menu");

document.addEventListener("click", (e) => {
  const btn = e.target.closest(".quizlink");
  if (!btn) return;

  loadSection(btn.dataset.section);
});

// ---- Timer ----
let timerInterval;
let startTime = null;
let elapsedTime = 0;
let running = false;

function updateTimer() {

    const totalSeconds = Math.floor(
        (elapsedTime + (running ? Date.now() - startTime : 0)) / 1000
    );

    let diff = totalSeconds;

    const years = Math.floor(diff / (365 * 24 * 60 * 60));
    diff %= 365 * 24 * 60 * 60;

    const months = Math.floor(diff / (30 * 24 * 60 * 60));
    diff %= 30 * 24 * 60 * 60;

    const weeks = Math.floor(diff / (7 * 24 * 60 * 60));
    diff %= 7 * 24 * 60 * 60;

    const days = Math.floor(diff / (24 * 60 * 60));
    diff %= 24 * 60 * 60;

    const hours = Math.floor(diff / 3600);
    diff %= 3600;

    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;

    document.getElementById("years").textContent = years;
    document.getElementById("months").textContent = months;
    document.getElementById("weeks").textContent = weeks;
    document.getElementById("days").textContent = days;
    document.getElementById("hours").textContent = hours;
    document.getElementById("minutes").textContent = minutes;
    document.getElementById("seconds").textContent = seconds;

    // Progress fills
    const secondsPercent = (totalSeconds % 60) / 60 * 100;

    const minutesPercent =
        ((totalSeconds % 3600) / 60) / 60 * 100;

    const hoursPercent =
        ((totalSeconds % 86400) / 3600) / 24 * 100;

    const daysPercent =
        ((totalSeconds % 604800) / 86400) / 7 * 100;

    const weeksPercent =
        ((totalSeconds % 2592000) / 604800) / 4.285 * 100;

    const monthsPercent =
        ((totalSeconds % 31536000) / 2592000) / 12 * 100;

    const yearsPercent =
        Math.min((totalSeconds / 31536000) * 100, 100);


    document.getElementById("secondsFill").style.width =
        secondsPercent + "%";

    document.getElementById("minutesFill").style.width =
        minutesPercent + "%";

    document.getElementById("hoursFill").style.width =
        hoursPercent + "%";

    document.getElementById("daysFill").style.width =
        daysPercent + "%";

    document.getElementById("weeksFill").style.width =
        weeksPercent + "%";

    document.getElementById("monthsFill").style.width =
        monthsPercent + "%";

    document.getElementById("yearsFill").style.width =
        yearsPercent + "%";
}

// START
document.addEventListener("click", function(e) {
    if (e.target.id === "startTimer") {

        if (running) return;
        running = true;
        startTime = Date.now();
        timerInterval = setInterval(updateTimer, 1000);

        updateTimer();
    }

    // STOP
    if (e.target.id === "stopTimer") {

        if (!running) return;
        running = false;
        elapsedTime += Date.now() - startTime;

        clearInterval(timerInterval);
    }

    // RESTART
    if (e.target.id === "restartTimer") {

        clearInterval(timerInterval);
        running = false;
        elapsedTime = 0;
        startTime = null;

        updateTimer();
    }
});