const API_URL = "https://task-backend-wsf7.onrender.com/api"; // your backend URL

// ------------------ Auth ------------------
const signupForm = document.getElementById("signupForm");
const loginForm = document.getElementById("loginForm");

//signup
if (signupForm) {
  signupForm.addEventListener("submit", async e => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (res.ok) {
        alert("Signup successful! Login now.");
        window.location.href = "index.html";
      } else alert(data.error);
    } catch (err) { console.error(err); }
  });
}

//login
if (loginForm) {
  loginForm.addEventListener("submit", async e => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        window.location.href = "dashboard.html";
      } else alert(data.error);
    } catch (err) { console.error(err); }
  });
}
