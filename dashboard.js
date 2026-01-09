const API_URL = "https://task-backend-wsf7.onrender.com/api"; // Replace with your backend URL

// Get DOM elements
const tasksContainer = document.getElementById("tasksContainer");
const taskForm = document.getElementById("taskForm");
const logoutBtn = document.getElementById("logoutBtn");

// Ensure user is logged in
const token = localStorage.getItem("token");
if (!token) window.location.href = "index.html";

// ------------------ Logout ------------------
logoutBtn.addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "index.html";
});

// ------------------ Helper: fetch with token ------------------
async function fetchWithToken(url, options = {}) {
  options.headers = {
    ...(options.headers || {}),
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };
  const res = await fetch(url, options);
  if (!res.ok) throw await res.json();
  return res.json();
}

// ------------------ Load Tasks ------------------
async function loadTasks() {
  try {
    const tasks = await fetchWithToken(`${API_URL}/tasks`);
    if (tasks.length === 0) {
      tasksContainer.innerHTML = `<p style="text-align:center;">No tasks yet. Add your first task!</p>`;
      return;
    }

    tasksContainer.innerHTML = tasks.map(t => `
      <div class="task-card ${t.completed ? 'completed' : ''}" data-id="${t._id}">
        <span>${t.title}</span>
        <div>
          <button onclick="toggleComplete('${t._id}', ${t.completed})">✔</button>
          <button onclick="deleteTask('${t._id}')">🗑</button>
        </div>
      </div>
    `).join('');
  } catch (err) {
    console.error(err);
    tasksContainer.innerHTML = `<p style="text-align:center; color:red;">Failed to load tasks.</p>`;
  }
}

// ------------------ Add Task ------------------
taskForm.addEventListener("submit", async e => {
  e.preventDefault();
  const title = document.getElementById("title").value.trim();
  if (!title) return;

  try {
    await fetchWithToken(`${API_URL}/tasks`, {
      method: "POST",
      body: JSON.stringify({ title })
    });
    taskForm.reset();
    loadTasks();
  } catch (err) {
    console.error(err);
  }
});

// ------------------ Toggle Complete ------------------
window.toggleComplete = async (id, completed) => {
  try {
    await fetchWithToken(`${API_URL}/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify({ completed: !completed })
    });
    loadTasks();
  } catch (err) {
    console.error(err);
  }
};

// ------------------ Delete Task ------------------
window.deleteTask = async (id) => {
  if (!confirm("Delete this task?")) return;
  try {
    await fetchWithToken(`${API_URL}/tasks/${id}`, { method: "DELETE" });
    loadTasks();
  } catch (err) {
    console.error(err);
  }
};

// Initial load
loadTasks();
