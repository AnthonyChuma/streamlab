async function loadCatalog() {
  const user = await ensureAuthenticated(["user"]);
  if (!user) return;

  const searchInput = document.getElementById("searchInput");
  const genreFilter = document.getElementById("genreFilter");
  const movieGrid = document.getElementById("movieGrid");
  const seriesGrid = document.getElementById("seriesGrid");
  const genresGrid = document.getElementById("genresGrid");

  let movies = [];
  let series = [];
  let genres = [];

  const renderMovies = (list) => {
    movieGrid.innerHTML = "";
    if (list.length === 0) {
      movieGrid.innerHTML = `<div class="empty-state">No se encontraron películas.</div>`;
      return;
    }

    list.forEach((movie) => {
      const card = document.createElement("article");
      card.className = "movie-card";
      card.innerHTML = `
        <div class="movie-image">
          <img src="${movie.image}" alt="${movie.title}" />
          <span class="movie-rating">${movie.rating.toFixed(1)}</span>
        </div>
        <div class="movie-info">
          <h3>${movie.title}</h3>
          <p class="movie-meta">${movie.genre} • ${movie.year}</p>
          <p class="movie-description">${movie.description}</p>
        </div>
      `;
      movieGrid.appendChild(card);
    });
  };

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

  const renderGenres = (list) => {
    genresGrid.innerHTML = "";
    if (list.length === 0) {
      genresGrid.innerHTML = `<div class="empty-state">No hay géneros disponibles.</div>`;
      return;
    }

    list.forEach((genre) => {
      const card = document.createElement("article");
      card.className = "movie-card";
      card.innerHTML = `
        <div class="movie-info">
          <h3>${genre.name}</h3>
          <p class="movie-description">${genre.description || "Sin descripción"}</p>
        </div>
      `;
      genresGrid.appendChild(card);
    });
  };

  const loadGenres = async () => {
    const response = await fetch("/api/genres");
    const data = await response.json();
    genres = data.genres || [];
    genreFilter.innerHTML = `<option value="all">Todos los géneros</option>` + genres.map((genre) => `<option value="${genre.name}">${genre.name}</option>`).join("");
    renderGenres(genres);
  };

  const loadMovies = async () => {
    const query = searchInput.value.trim();
    const genre = genreFilter.value;
    const params = new URLSearchParams();
    if (query) params.append("title", query);
    if (genre && genre !== "all") params.append("genre", genre);

    const response = await fetch(`/api/movies/search?${params.toString()}`);
    const data = await response.json();
    movies = data.movies || [];
    renderMovies(movies);
  };

  const applyFilters = async () => {
    await loadMovies();
  };

  const loadSeriesData = async () => {
    const response = await fetch("/api/series");
    const data = await response.json();
    series = data.series || [];
    applyFilters();
  };

  searchInput.addEventListener("input", applyFilters);
  genreFilter.addEventListener("change", applyFilters);

  document.getElementById("logoutButton").addEventListener("click", () => {
    logout();
    window.location.href = "/login";
  });

  await Promise.all([loadGenres(), loadMovies(), loadSeriesData()]);
}

loadCatalog();