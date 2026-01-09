const API_URL = "https://task-backend-wsf7.onrender.com/api"; // Backend URL

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

// ------------------ Helper: fetch with token & safe error handling ------------------
async function fetchWithToken(url, options = {}) {
  options.headers = {
    ...(options.headers || {}),
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const res = await fetch(url, options);

  if (!res.ok) {
    try {
      const errorData = await res.json();
      console.error("Backend error:", errorData);
      throw errorData;
    } catch {
      const text = await res.text();
      console.error("Fetch error (non-JSON):", text);
      throw { error: text };
    }
  }

  try {
    return await res.json();
  } catch {
    console.error("Response is not JSON:", await res.text());
    return null;
  }
}

// ------------------ Load Tasks ------------------
async function loadTasks() {
  try {
    const tasks = await fetchWithToken(`${API_URL}/tasks`);
    if (!tasks || tasks.length === 0) {
      tasksContainer.innerHTML = `<p style="text-align:center;">No tasks yet. Add your first task!</p>`;
      return;
    }

    // Render tasks with Edit button
    tasksContainer.innerHTML = tasks
      .map(
        (t) => `
      <div class="task-card ${t.completed ? "completed" : ""}" data-id="${t._id}">
        <span>${t.title}</span>
        <div>
          <button onclick="toggleComplete('${t._id}', ${t.completed})">✔</button>
          <button onclick="editTask('${t._id}', '${t.title.replace(/'/g, "\\'").replace(/"/g, "&quot;")}')">✏️</button>
          <button onclick="deleteTask('${t._id}')">🗑</button>
        </div>
      </div>
    `
      )
      .join("");
  } catch (err) {
    console.error("Failed to load tasks:", err);
    tasksContainer.innerHTML = `<p style="text-align:center; color:red;">Failed to load tasks.</p>`;
  }
}

// ------------------ Add Task ------------------
taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value.trim();
  if (!title) return;

  try {
    await fetchWithToken(`${API_URL}/tasks`, {
      method: "POST",
      body: JSON.stringify({ title }),
    });
    taskForm.reset();
    loadTasks();
  } catch (err) {
    console.error("Failed to add task:", err);
    alert(err.error || "Failed to add task.");
  }
});

// ------------------ Toggle Complete ------------------
window.toggleComplete = async (id, completed) => {
  try {
    await fetchWithToken(`${API_URL}/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify({ completed: !completed }),
    });
    loadTasks();
  } catch (err) {
    console.error("Failed to toggle task:", err);
    alert(err.error || "Failed to update task.");
  }
};

// ------------------ Edit Task ------------------
window.editTask = async (id, currentTitle) => {
  const newTitle = prompt("Edit task title:", currentTitle);
  if (!newTitle || newTitle === currentTitle) return;

  try {
    await fetchWithToken(`${API_URL}/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify({ title: newTitle }),
    });
    loadTasks();
  } catch (err) {
    console.error("Failed to edit task:", err);
    alert(err.error || "Failed to update task.");
  }
};

// ------------------ Delete Task ------------------
window.deleteTask = async (id) => {
  if (!confirm("Delete this task?")) return;

  try {
    await fetchWithToken(`${API_URL}/tasks/${id}`, { method: "DELETE" });
    loadTasks();
  } catch (err) {
    console.error("Failed to delete task:", err);
    alert(err.error || "Failed to delete task.");
  }
};

// ------------------ Initial load ------------------
loadTasks();
