const STREAM_TOKEN = "streamlab_token";

function saveToken(token) {
  localStorage.setItem(STREAM_TOKEN, token);
  document.cookie = `auth_token=${token}; path=/`;
}

function getToken() {
  return localStorage.getItem(STREAM_TOKEN);
}

function ensureTokenCookie() {
  const token = getToken();
  if (token && !document.cookie.includes("auth_token=")) {
    document.cookie = `auth_token=${token}; path=/`;
  }
}

function logout() {
  localStorage.removeItem(STREAM_TOKEN);
  document.cookie = "auth_token=; Max-Age=0; path=/";
}

ensureTokenCookie();

async function authFetch(url, options = {}) {
  const token = getToken();
  const headers = options.headers || {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return fetch(url, {
    ...options,
    headers,
  });
}

async function getProfile() {
  const response = await authFetch("/api/auth/profile");
  if (!response.ok) throw new Error("No autorizado");
  return response.json();
}

async function ensureAuthenticated(allowedRoles = []) {
  const token = getToken();
  if (!token) {
    window.location.href = "/login";
    return null;
  }

  try {
    const data = await getProfile();
    if (allowedRoles.length > 0 && !allowedRoles.includes(data.user.role)) {
      if (data.user.role === "admin") {
        window.location.href = "/admin.html";
      } else if (data.user.role === "manager") {
        window.location.href = "/manager.html";
      } else {
        window.location.href = "/catalog.html";
      }
      return null;
    }
    return data.user;
  } catch (error) {
    logout();
    window.location.href = "/login";
    return null;
  }
}

async function loadUserMenu() {
  const container = document.getElementById("userActions");
  if (!container) return;

  const token = getToken();
  if (!token) {
    container.innerHTML = `<a class="link-button" href="/login">Iniciar sesión</a>`;
    return;
  }

  try {
    const response = await authFetch("/api/auth/me");
    if (!response.ok) throw new Error("No autorizado");
    const data = await response.json();
    container.innerHTML = `
      <span class="user-badge">${data.user.username}</span>
      <a class="link-button" href="/profile">Perfil</a>
      <button class="button tertiary" id="logoutBtn">Cerrar sesión</button>
    `;
    document.getElementById("logoutBtn").addEventListener("click", () => {
      logout();
      window.location.reload();
    });
  } catch (error) {
    logout();
    container.innerHTML = `<a class="link-button" href="/login">Iniciar sesión</a>`;
  }
}

loadUserMenu();
