async function loadSeries() {
  const user = await ensureAuthenticated(["user"]);
  if (!user) return;

  const searchInput = document.getElementById("searchInput");
  const genreFilter = document.getElementById("genreFilter");
  const seriesGrid = document.getElementById("seriesGrid");
  const logoutButton = document.getElementById("logoutButton");

  logoutButton?.addEventListener("click", () => {
    logout();
    window.location.href = "/login";
  });

  let series = [];

  const renderSeries = (list) => {
    seriesGrid.innerHTML = "";
    if (list.length === 0) {
      seriesGrid.innerHTML = `<div class="empty-state">No se encontraron series.</div>`;
      return;
    }

    list.forEach((item) => {
      const card = document.createElement("article");
      card.className = "movie-card";
      card.innerHTML = `
        <div class="movie-image">
          <img src="${item.image}" alt="${item.title}" />
          <span class="movie-rating">${item.rating.toFixed(1)}</span>
        </div>
        <div class="movie-info">
          <h3>${item.title}</h3>
          <p class="movie-meta">${item.genre} • ${item.year}</p>
          <p class="movie-description">${item.description}</p>
        </div>
      `;
      seriesGrid.appendChild(card);
    });
  };

  const loadGenres = async () => {
    const response = await fetch("/api/genres");
    const data = await response.json();
    genreFilter.innerHTML = `<option value="all">Todos los géneros</option>` + (data.genres || []).map((genre) => `<option value="${genre.name}">${genre.name}</option>`).join("");
  };

  const applyFilters = () => {
    const search = searchInput.value.trim().toLowerCase();
    const genre = genreFilter.value;
    const filtered = series.filter((item) => {
      const matchesGenre = genre === "all" || item.genre === genre;
      const text = `${item.title} ${item.description}`.toLowerCase();
      return matchesGenre && text.includes(search);
    });
    renderSeries(filtered);
  };

  const loadSeriesData = async () => {
    const response = await fetch("/api/series");
    const data = await response.json();
    series = data.series || [];
    applyFilters();
  };

  searchInput.addEventListener("input", applyFilters);
  genreFilter.addEventListener("change", applyFilters);

  await Promise.all([loadGenres(), loadSeriesData()]);
}

loadSeries();