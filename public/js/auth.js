async function handleLogin(event) {
  event.preventDefault();
  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value.trim();
  const message = document.getElementById("loginMessage");

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      message.textContent = data.error || "No se pudo iniciar sesión";
      return;
    }

    saveToken(data.token);
    if (data.user.role === "admin") {
      window.location.href = "/admin.html";
    } else if (data.user.role === "manager") {
      window.location.href = "/manager.html";
    } else {
      window.location.href = "/catalog.html";
    }
  } catch (error) {
    message.textContent = "Error de conexión";
  }
}

async function handleSignup(event) {
  event.preventDefault();
  const username = document.getElementById("signupUsername").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value.trim();
  const message = document.getElementById("signupMessage");

  try {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await response.json();
    if (!response.ok) {
      message.textContent = data.error || "No se pudo crear la cuenta";
      return;
    }
    saveToken(data.token);
    window.location.href = "/catalog.html";
  } catch (error) {
    message.textContent = "Error de conexión";
  }
}

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const loginCancel = document.getElementById("loginCancel");
const signupCancel = document.getElementById("signupCancel");

if (loginForm) loginForm.addEventListener("submit", handleLogin);
if (signupForm) signupForm.addEventListener("submit", handleSignup);
if (loginCancel) loginCancel.addEventListener("click", () => { window.location.href = "/"; });
if (signupCancel) signupCancel.addEventListener("click", () => { window.location.href = "/"; });
