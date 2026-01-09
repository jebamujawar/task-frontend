# Task Manager App

A simple full-stack task management application built 
with **Node.js, Express, MongoDB**, and a **JavaScript frontend**
 hosted on GitHub Pages. Users can **sign up, log in, add, update, 
 and delete tasks**. JWT authentication is used to secure API routes.

---
## 🚀 Live Project Links

🔗 **Frontend (GitHub Pages)**  
 https://jebamujawar.github.io/task-frontend/

🔗 **Backend API (Render)**  
https://task-backend-wsf7.onrender.com

---
## Features

- User authentication (signup/login) with JWT
- Create, read, update, and delete tasks (CRUD)
- Each user sees only their tasks
- Tasks can be marked as completed
- Frontend hosted on GitHub Pages
- Backend hosted on Render
- CORS configured for GitHub Pages frontend

---

## Tech Stack

- **Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT, bcrypt
- **Frontend:** HTML, CSS, Vanilla JS
- **Deployment:** GitHub Pages (frontend), Render (backend)

---

## Project Structure

task-manager/
│
├─ backend/
│ ├─ models/
│ │ ├─ User.js
│ │ └─ Task.js
│ ├─ routes/
│ │ ├─ auth.js
│ │ └─ tasks.js
│ ├─ middleware/
│ │ └─ auth.js
│ └─ server.js
│
├─ frontend/
│ ├─ index.html
│ ├─ dashboard.html
│ ├─ script.js
│ └─ dashboard.js
│
├─ .env
└─ README.md

