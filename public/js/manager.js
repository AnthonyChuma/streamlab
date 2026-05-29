const managerMoviesTable = document.getElementById("managerMoviesTable");
const managerMovieForm = document.getElementById("managerMovieForm");
const logoutButton = document.getElementById("logoutButton");
const backHomeButton = document.getElementById("backHomeButton");

logoutButton?.addEventListener("click", () => {
  logout();
  window.location.href = "/login";
});

backHomeButton?.addEventListener("click", () => {
  window.location.href = "/";
});

async function loadMovies() {
  try {
    const response = await authFetch("/api/movies");
    const data = await response.json();
    managerMoviesTable.innerHTML = data.movies.map((movie) => `
      <tr>
        <td>${movie.title}</td>
        <td>${movie.genre}</td>
        <td>${movie.year}</td>
        <td>${movie.rating.toFixed(1)}</td>
        <td>
          <button class="button tertiary" onclick="editMovie('${movie._id}')">Editar</button>
          <button class="button danger" onclick="deleteMovie('${movie._id}')">Eliminar</button>
        </td>
      </tr>
    `).join("");
  } catch (error) {
    managerMoviesTable.innerHTML = `<tr><td colspan="5">Error cargando películas.</td></tr>`;
  }
}

window.editMovie = async function editMovie(id) {
  const title = prompt("Nuevo título:");
  const genre = prompt("Nuevo género:");
  const year = prompt("Nuevo año:");
  const rating = prompt("Nuevo rating:");
  const image = prompt("Nueva URL de imagen:");
  const description = prompt("Nueva descripción:");
  if (!title || !genre || !year || !rating || !image || !description) return;
  await authFetch(`/api/movies/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, genre, year: Number(year), rating: Number(rating), image, description }),
  });
  loadMovies();
};

window.deleteMovie = async function deleteMovie(id) {
  if (!confirm("¿Eliminar esta película?")) return;
  await authFetch(`/api/movies/${id}`, { method: "DELETE" });
  loadMovies();
};

managerMovieForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const title = document.getElementById("managerMovieTitle").value.trim();
  const genre = document.getElementById("managerMovieGenre").value.trim();
  const year = Number(document.getElementById("managerMovieYear").value);
  const rating = Number(document.getElementById("managerMovieRating").value);
  const image = document.getElementById("managerMovieImage").value.trim();
  const description = document.getElementById("managerMovieDescription").value.trim();

  await authFetch("/api/movies", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, genre, year, rating, image, description }),
  });
  event.target.reset();
  loadMovies();
});

async function initManager() {
  const user = await ensureAuthenticated(["manager", "admin"]);
  if (!user) return;

  loadMovies();
}

initManager();
