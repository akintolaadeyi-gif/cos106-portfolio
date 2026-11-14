/* =========================================================
   projects.js — builds project cards from the projects array
   Used on two pages:
   - Home: shows only projects with featured: true
   - Projects: shows all, with filter buttons
   ========================================================= */

// Build the HTML for one card. Template literals (`...`) let us
// drop values into the markup with ${ }.
function createCard(project) {
  const tagsHtml = project.tags.map((tag) => `<li>${tag}</li>`).join("");

  // Only show the links this project actually has
  let linksHtml = "";
  if (project.links.live) linksHtml += `<a href="${project.links.live}" target="_blank" rel="noopener">Live site ↗</a>`;
  if (project.links.code) linksHtml += `<a href="${project.links.code}" target="_blank" rel="noopener">Source code ↗</a>`;
  if (!linksHtml) linksHtml = `<span class="muted">Client project, link on request</span>`;

  return `
    <article class="card reveal">
      <img src="${project.image}" alt="Preview of ${project.title}" loading="lazy" width="640" height="400">
      <div class="card-body">
        <span class="card-meta">${project.subtitle} · ${project.year}</span>
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <ul class="tags">${tagsHtml}</ul>
        <div class="card-links">${linksHtml}</div>
      </div>
    </article>`;
}

function renderProjects(container, list) {
  container.innerHTML = list.map(createCard).join("");
  // The new cards were not on the page when main.js ran, so observe them now
  if (typeof observeReveals === "function") observeReveals();
}

// ---------- Home page: featured projects ----------
const featuredGrid = document.getElementById("featured-projects");
if (featuredGrid) {
  renderProjects(featuredGrid, projects.filter((p) => p.featured));
}

// ---------- Projects page: all projects + filters ----------
const projectGrid = document.getElementById("project-grid");
if (projectGrid) {
  const filterButtons = document.querySelectorAll("[data-filter]");
  const resultCount = document.getElementById("result-count");

  function showCategory(category) {
    const list = category === "all"
      ? projects
      : projects.filter((p) => p.categories.includes(category));

    renderProjects(projectGrid, list);
    resultCount.textContent = `Showing ${list.length} of ${projects.length} projects`;

    // Highlight the active button
    filterButtons.forEach((btn) => {
      const isActive = btn.dataset.filter === category;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-pressed", isActive);
    });
  }

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => showCategory(btn.dataset.filter));
  });

  showCategory("all");
}
