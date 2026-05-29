const searchInput = document.getElementById("searchInput");
const genreFilter = document.getElementById("genreFilter");
const carousel = document.getElementById("carousel");
const movieGrid = document.getElementById("movieGrid");

let movies = [];

function createMovieCard(movie) {
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
  return card;
}

function renderMovies(list) {
  movieGrid.innerHTML = "";
  carousel.innerHTML = "";

  if (list.length === 0) {
    movieGrid.innerHTML = `<div class="empty-state">No se encontraron películas.</div>`;
    return;
  }

  list.slice(0, 5).forEach((movie) => {
    const slide = document.createElement("div");
    slide.className = "carousel-card";
    slide.innerHTML = `
      <img src="${movie.image}" alt="${movie.title}" />
      <div class="carousel-text">
        <span class="card-label">${movie.genre}</span>
        <h3>${movie.title}</h3>
        <p>${movie.description}</p>
      </div>
    `;
    carousel.appendChild(slide);
  });

  list.forEach((movie) => {
    movieGrid.appendChild(createMovieCard(movie));
  });
}

async function fetchMovies() {
  try {
    const response = await fetch("/api/movies");
    const data = await response.json();
    movies = data.movies || [];
    applyFilters();
  } catch (error) {
    movieGrid.innerHTML = `<div class="empty-state">Error cargando las películas.</div>`;
  }
}

function applyFilters() {
  const query = searchInput.value.trim().toLowerCase();
  const genre = genreFilter.value;

  const filtered = movies.filter((movie) => {
    const matchesGenre = genre === "all" || movie.genre === genre;
    const text = `${movie.title} ${movie.description} ${movie.genre}`.toLowerCase();
    const matchesSearch = text.includes(query);
    return matchesGenre && matchesSearch;
  });

  renderMovies(filtered);
}

if (searchInput) searchInput.addEventListener("input", applyFilters);
if (genreFilter) genreFilter.addEventListener("change", applyFilters);

fetchMovies();
