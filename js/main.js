const contentEl = document.getElementById("content");
const navLinks = document.querySelectorAll(".nav-link");
const seasonSelect = document.getElementById("season-select");
const modeToggle = document.getElementById("mode-toggle");
const html = document.documentElement;

// ---- Section loading ----
// Each topic lives in its own file under /sections. Swap this instead
// of scrolling a 3000-line document to find the ADHD block.
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

modeToggle.addEventListener("click", () => {
  const isDark = html.getAttribute("data-mode") === "dark";
  html.setAttribute("data-mode", isDark ? "light" : "dark");
  modeToggle.textContent = isDark ? "🌙 Dark mode" : "☀️ Light mode";
  modeToggle.setAttribute("aria-pressed", String(!isDark));
});

// ---- Initial load ----
loadSection("menu");