const usersTable = document.getElementById("usersTable");
const moviesTable = document.getElementById("moviesTable");
const seriesTable = document.getElementById("seriesTable");
const genresTable = document.getElementById("genresTable");
const totalUsersEl = document.getElementById("totalUsers");
const totalMoviesEl = document.getElementById("totalMovies");
const totalSeriesEl = document.getElementById("totalSeries");
const totalGenresEl = document.getElementById("totalGenres");
const logoutButton = document.getElementById("logoutButton");
const createUserForm = document.getElementById("createUserForm");
const createMovieForm = document.getElementById("createMovieForm");
const createSeriesForm = document.getElementById("createSeriesForm");
const createGenreForm = document.getElementById("createGenreForm");

logoutButton?.addEventListener("click", () => {
  logout();
  window.location.href = "/login";
});

async function updateStats() {
  try {
    const response = await authFetch("/api/dashboard/stats");
    if (!response.ok) throw new Error();
    const data = await response.json();

    totalUsersEl.textContent = data.totalUsers;
    totalMoviesEl.textContent = data.totalMovies;
    totalSeriesEl.textContent = data.totalSeries;
    totalGenresEl.textContent = data.totalGenres;

    usersTable.innerHTML = data.users.map((user) => `
      <tr>
        <td>${user.username}</td>
        <td>${user.email}</td>
        <td>
          <select onchange="updateUserRole('${user._id}', this.value)">
            <option value="user" ${user.role === "user" ? "selected" : ""}>user</option>
            <option value="manager" ${user.role === "manager" ? "selected" : ""}>manager</option>
            <option value="admin" ${user.role === "admin" ? "selected" : ""}>admin</option>
          </select>
        </td>
        <td>
          <button class="button danger" onclick="deleteUser('${user._id}')">Eliminar</button>
        </td>
      </tr>
    `).join("");

    moviesTable.innerHTML = data.movies.map((movie) => `
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

    seriesTable.innerHTML = data.series.map((serie) => `
      <tr>
        <td>${serie.title}</td>
        <td>${serie.genre}</td>
        <td>${serie.year}</td>
        <td>${serie.rating.toFixed(1)}</td>
        <td>
          <button class="button tertiary" onclick="editSeries('${serie._id}')">Editar</button>
          <button class="button danger" onclick="deleteSeries('${serie._id}')">Eliminar</button>
        </td>
      </tr>
    `).join("");

    genresTable.innerHTML = data.genres.map((genre) => `
      <tr>
        <td>${genre.name}</td>
        <td>${genre.description || "-"}</td>
        <td>
          <button class="button tertiary" onclick="editGenre('${genre._id}')">Editar</button>
          <button class="button danger" onclick="deleteGenre('${genre._id}')">Eliminar</button>
        </td>
      </tr>
    `).join("");
  } catch (error) {
    window.location.href = "/login";
  }
}

window.updateUserRole = async function updateUserRole(id, role) {
  await authFetch(`/api/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role }),
  });
  updateStats();
};

window.deleteUser = async function deleteUser(id) {
  if (!confirm("¿Eliminar este usuario?")) return;
  await authFetch(`/api/users/${id}`, { method: "DELETE" });
  updateStats();
};

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
  updateStats();
};

window.deleteMovie = async function deleteMovie(id) {
  if (!confirm("¿Eliminar esta película?")) return;
  await authFetch(`/api/movies/${id}`, { method: "DELETE" });
  updateStats();
};

window.editSeries = async function editSeries(id) {
  const title = prompt("Nuevo título:");
  const genre = prompt("Nuevo género:");
  const year = prompt("Nuevo año:");
  const rating = prompt("Nuevo rating:");
  const image = prompt("Nueva URL de imagen:");
  const description = prompt("Nueva descripción:");
  if (!title || !genre || !year || !rating || !image || !description) return;
  await authFetch(`/api/series/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, genre, year: Number(year), rating: Number(rating), image, description }),
  });
  updateStats();
};

window.deleteSeries = async function deleteSeries(id) {
  if (!confirm("¿Eliminar esta serie?")) return;
  await authFetch(`/api/series/${id}`, { method: "DELETE" });
  updateStats();
};

window.editGenre = async function editGenre(id) {
  const name = prompt("Nuevo nombre de género:");
  const description = prompt("Nueva descripción:");
  if (!name) return;
  await authFetch(`/api/genres/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, description }),
  });
  updateStats();
};

window.deleteGenre = async function deleteGenre(id) {
  if (!confirm("¿Eliminar este género?")) return;
  await authFetch(`/api/genres/${id}`, { method: "DELETE" });
  updateStats();
};

createUserForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const username = document.getElementById("newUserName").value.trim();
  const email = document.getElementById("newUserEmail").value.trim();
  const password = document.getElementById("newUserPassword").value.trim();
  const role = document.getElementById("newUserRole").value;
  await authFetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password, role }),
  });
  event.target.reset();
  updateStats();
});

createMovieForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const title = document.getElementById("movieTitle").value.trim();
  const genre = document.getElementById("movieGenre").value.trim();
  const year = Number(document.getElementById("movieYear").value);
  const rating = Number(document.getElementById("movieRating").value);
  const image = document.getElementById("movieImage").value.trim();
  const description = document.getElementById("movieDescription").value.trim();
  await authFetch("/api/movies", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, genre, year, rating, image, description }),
  });
  event.target.reset();
  updateStats();
});

createSeriesForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const title = document.getElementById("seriesTitle").value.trim();
  const genre = document.getElementById("seriesGenre").value.trim();
  const year = Number(document.getElementById("seriesYear").value);
  const rating = Number(document.getElementById("seriesRating").value);
  const image = document.getElementById("seriesImage").value.trim();
  const description = document.getElementById("seriesDescription").value.trim();
  await authFetch("/api/series", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, genre, year, rating, image, description }),
  });
  event.target.reset();
  updateStats();
});

createGenreForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const name = document.getElementById("genreName").value.trim();
  const description = document.getElementById("genreDescription").value.trim();
  await authFetch("/api/genres", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, description }),
  });
  event.target.reset();
  updateStats();
});

async function initAdmin() {
  const user = await ensureAuthenticated(["admin"]);
  if (!user) return;

  document.getElementById("backHomeButton")?.addEventListener("click", () => {
    window.location.href = "/";
  });

  updateStats();
}

initAdmin();
