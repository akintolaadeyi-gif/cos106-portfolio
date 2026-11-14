/* =========================================================
   projects.js — builds project cards from the projects array
   Used on two pages:
   - Home: shows only projects with featured: true, as image tiles
   - Projects: shows all, with filter buttons
   ========================================================= */

// Arrow icon from the Lucide icon set (lucide.dev), used on outbound links
const ARROW_ICON = '<svg aria-hidden="true" class="icon icon-arrow-up-right" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>';

// Build the HTML for one card. Template literals (`...`) let us
// drop values into the markup with ${ }.
function createCard(project) {
  const tagsHtml = project.tags.map((tag) => `<li>${tag}</li>`).join("");

  // Only show the links this project actually has
  let linksHtml = "";
  if (project.links.live) linksHtml += `<a href="${project.links.live}" target="_blank" rel="noopener">Live site ${ARROW_ICON}</a>`;
  if (project.links.code) linksHtml += `<a href="${project.links.code}" target="_blank" rel="noopener">Source code ${ARROW_ICON}</a>`;
  if (!linksHtml) linksHtml = `<span class="muted">Client project, link on request</span>`;

  return `
    <article class="card reveal">
      <div class="card-img"><img src="${project.image}" alt="Preview of ${project.title}" loading="lazy" width="1200" height="960"></div>
      <div class="card-body">
        <span class="card-meta">${project.subtitle} · ${project.year}</span>
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <ul class="tags">${tagsHtml}</ul>
        <div class="card-links">${linksHtml}</div>
      </div>
    </article>`;
}

// Home page tile: the whole image is a link to the Projects page,
// with the name and type laid over the bottom of the picture.
function createTile(project) {
  return `
    <a class="work-item reveal" href="projects.html">
      <img src="${project.image}" alt="Preview of ${project.title}" loading="lazy" width="1200" height="960">
      <span class="work-overlay">
        <span class="work-title">${project.title}</span>
        <span class="work-meta">${project.subtitle} · ${project.year}</span>
      </span>
    </a>`;
}

// buildHtml is a function passed in (createCard or createTile),
// so one render function works for both layouts.
function renderProjects(container, list, buildHtml = createCard) {
  container.innerHTML = list.map(buildHtml).join("");
  // The new cards were not on the page when main.js ran, so observe them now
  if (typeof observeReveals === "function") observeReveals();
}

// ---------- Home page: featured projects ----------
const featuredGrid = document.getElementById("featured-projects");
if (featuredGrid) {
  renderProjects(featuredGrid, projects.filter((p) => p.featured), createTile);
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
