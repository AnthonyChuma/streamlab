async function loadGenresPage() {
  const user = await ensureAuthenticated(["user"]);
  if (!user) return;

  const genresGrid = document.getElementById("genresGrid");
  const logoutButton = document.getElementById("logoutButton");

  logoutButton?.addEventListener("click", () => {
    logout();
    window.location.href = "/login";
  });

  const response = await fetch("/api/genres");
  const data = await response.json();
  const genres = data.genres || [];

  if (genres.length === 0) {
    genresGrid.innerHTML = `<div class="empty-state">No hay géneros disponibles.</div>`;
    return;
  }

  genresGrid.innerHTML = genres.map((genre) => `
    <article class="movie-card">
      <div class="movie-info">
        <h3>${genre.name}</h3>
        <p class="movie-description">${genre.description || "Género sin descripción"}</p>
      </div>
    </article>
  `).join("");
}

loadGenresPage();