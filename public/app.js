const totalUsersEl = document.getElementById("totalUsers");
const totalAdminsEl = document.getElementById("totalAdmins");
const totalUsersRoleEl = document.getElementById("totalUsersRole");
const totalBalanceEl = document.getElementById("totalBalance");
const usersTableBody = document.getElementById("usersTableBody");
const searchInput = document.getElementById("searchInput");
const roleFilter = document.getElementById("roleFilter");
const refreshButton = document.getElementById("refreshButton");

let usuariosGlobal = [];

const formatBalance = (value) => {
  return value.toLocaleString("es-ES", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  });
};

const getRoleBadge = (role) => {
  const label = role.toLowerCase();
  const badge = document.createElement("span");
  badge.className = `badge ${label}`;
  badge.textContent = label;
  return badge;
};

const renderSummaries = (usuarios) => {
  const total = usuarios.length;
  const totalAdmins = usuarios.filter((user) => user.role === "admin").length;
  const totalUsers = usuarios.filter((user) => user.role === "user").length;

  if (totalUsersEl) totalUsersEl.textContent = total;
  if (totalAdminsEl) totalAdminsEl.textContent = totalAdmins;
  if (totalUsersRoleEl) totalUsersRoleEl.textContent = totalUsers;
  if (totalBalanceEl) totalBalanceEl.textContent = "$0";
};

const renderUsersTable = (usuarios) => {
  usersTableBody.innerHTML = "";

  if (usuarios.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="4" class="empty-state">No se encontraron usuarios con esos criterios</td>`;
    usersTableBody.appendChild(row);
    return;
  }

  usuarios.forEach((user) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user.username}</td>
      <td></td>
      <td>${user.email}</td>
      <td>${formatBalance(Number(user.balance) || 0)}</td>
    `;

    const badgeCell = row.querySelector("td:nth-child(2)");
    badgeCell.appendChild(getRoleBadge(user.role));
    usersTableBody.appendChild(row);
  });
};

const applyFilters = () => {
  const searchValue = searchInput.value.trim().toLowerCase();
  const selectedRole = roleFilter.value;

  const filtered = usuariosGlobal.filter((user) => {
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    const searchText = `${user.username} ${user.email}`.toLowerCase();
    const matchesSearch = searchText.includes(searchValue);
    return matchesRole && matchesSearch;
  });

  renderSummaries(filtered);
  renderUsersTable(filtered);
};

const fetchUsuarios = async () => {
  try {
    usersTableBody.innerHTML = `<tr><td colspan="4" class="empty-state">Cargando datos...</td></tr>`;
    const response = await fetch("/usuarios");
    if (!response.ok) throw new Error("Error al cargar usuarios");
    const data = await response.json();

    usuariosGlobal = Array.isArray(data.usuarios) ? data.usuarios : [];
    applyFilters();
  } catch (error) {
    usersTableBody.innerHTML = `<tr><td colspan="4" class="empty-state">No se pudieron cargar los usuarios. Intenta de nuevo.</td></tr>`;
    totalUsersEl.textContent = "-";
    totalAdminsEl.textContent = "-";
    totalUsersRoleEl.textContent = "-";
    totalBalanceEl.textContent = "-";
    console.error(error);
  }
};

searchInput.addEventListener("input", applyFilters);
roleFilter.addEventListener("change", applyFilters);
refreshButton.addEventListener("click", fetchUsuarios);

fetchUsuarios();
