<div  align="center">

  

# DevMind 🧠

  

**An AI-powered developer journal for tracking what you learn, every day.**

  

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev)

[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)](https://nodejs.org)

[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb)](https://mongodb.com)

[![Redux](https://img.shields.io/badge/Redux-RTK%20Query-764ABC?style=flat-square&logo=redux)](https://redux-toolkit.js.org)

  

[Features](#features) · [Tech Stack](#tech-stack) · [Getting Started](#getting-started) · [API Reference](#api-reference) · [Screenshots](#screenshots)

  

</div>

  

---

  

## What is DevMind?

  

DevMind is a full-stack developer journaling app that helps you log what you learn each day, track your growth over time, and use AI to reflect, summarise, and quiz yourself on your own notes.

  

Built as a portfolio project to demonstrate MERN stack skills and AI integration.

  

---

  

## Features

  

### Phase 1 — Core Journal (Complete ✅)

-  **Rich text editor** — write entries with bold, italic, headings, bullet lists, code blocks and blockquotes powered by TipTap

-  **JWT Authentication** — secure register, login and logout with token-based auth

-  **Entry management** — create, edit, delete and browse journal entries

-  **Tag system** — tag entries by topic (React, Node.js, MongoDB etc.) for easy filtering

-  **Mood & type tracking** — log how each session felt and what kind of entry it was

-  **Dashboard stats** — total entries, current streak, best streak, skills logged

-  **Activity grid** — GitHub-style contribution grid showing your journaling streak

-  **Protected routes** — all content behind authentication, both frontend and backend

  

### Phase 2 — AI Integration (In Progress 🚧)

- AI-powered entry summarisation

- Quiz mode — get quizzed on what you've written

- Smart tag suggestions from entry content

- Semantic search across your entries using RAG

- Personalised study planner agent

  

---

  

## Tech Stack

  

<div align="center">

  

### 🎨 Frontend

  

<img src="https://skillicons.dev/icons?i=react,redux,tailwind" />

  

</div>

  

- **React 18** — Component-based UI framework

- **Tailwind CSS** — Utility-first styling

- **Redux Toolkit + RTK Query** — State management & API handling

- **TipTap** — Rich text editor

- **React Router v6** — Client-side navigation

  

---

  

<div align="center">

  

### ⚙️ Backend

  

<img src="https://skillicons.dev/icons?i=nodejs,express,mongodb" />

  

</div>

  

- **Node.js + Express** — REST API server

- **MongoDB + Mongoose** — Database & ODM

- **JWT (JSON Web Tokens)** — Authentication

- **bcryptjs** — Password hashing

  

---

  

## Getting Started

  

### Prerequisites

- Node.js 18+

- MongoDB Atlas account (free tier works fine)

  

### 1. Clone the repository

  

```bash

git  clone  https://github.com/Riya1211/devmind.git

cd  devmind

```

  

### 2. Setup the backend

  

```bash

cd  server

npm  install

```

  

Create a `.env` file in the `server` folder:

  

```env

MONGO_URI=your_mongodb_atlas_connection_string

PORT=8080

JWT_SECRET=your_long_random_secret_key

```

  

Start the server:

  

```bash

npm  run  dev

```

  

You should see:

```

DB Connected to ...mongodb.net

Server running on port 8080

```

  

### 3. Setup the frontend

  

```bash

cd  client

npm  install

npm  run  dev

```

  

Open [http://localhost:5173](http://localhost:5173) in your browser.

  

---

  
## 📁 Project Structure

  

```bash

devmind/

├── 🚀 client/ # React frontend

│ └── src/

│ ├── 🧩 components/ # Reusable UI components

│ │ ├── Editor.jsx # TipTap rich text editor

│ │ ├── EntryList.jsx # Entries list (dashboard + all entries)

│ │ ├── Sidebar.jsx # Navigation sidebar

│ │ ├── StatCard.jsx # Dashboard stat cards

│ │ ├── StreakGrid.jsx # GitHub-style activity grid

│ │ └── TopBar.jsx # Header section

│ │

│ ├── 📄 pages/ # Page-level components

│ │ ├── Dashboard.jsx

│ │ ├── AllEntries.jsx

│ │ ├── WriteEntry.jsx

│ │ ├── Login.jsx

│ │ └── Register.jsx

│ │

│ └── 🗂️ store/

│ └── api/

│ └── authApi.js # RTK Query endpoints

│

└── 🛠️ server/ # Node.js backend

├── 🎮 controllers/

│ ├── auth.js # Auth logic (register/login)

│ └── entry.js # Entry CRUD + stats

│

├── 🧱 middlewares/

│ ├── auth.js # JWT verification

│ └── error.js # Error handling wrapper

│

├── 🗄️ models/

│ ├── User.js # User schema

│ └── Entry.js # Entry schema

│

├── 🌐 routes/

│ ├── auth.js

│ └── entry.js

│

├── ⚙️ utils/

│ └── errorHandler.js # Custom error class

│

└── app.js # Express app entry point

``` 
---
  

## API Reference

  

All protected routes require a Bearer token in the Authorization header.

  

### Auth

  
  

- POST /api/auth/register → Create a new account

- POST /api/auth/login → Login and receive token

  

**Register body:**

```json

{

"name": "Riya",

"email": "riya@dev.io",

"password": "yourpassword"

}

```

  

**Login response:**

```json

{

"success": true,

"token": "eyJhbGci...",

"user": { "_id": "...", "name": "Riya", "email": "riya@dev.io" }

}

```

  

### Entries

  


- GET /api/entries → Get all entries

- POST /api/entries → Create entry

- GET /api/entries/:id → Get single entry

- PUT /api/entries/:id → Update entry

- DELETE /api/entries/:id → Delete entry

- GET /api/entries/stats → Dashboard stats

  

**Create entry body:**

```json

{

"title": "JWT Auth finally clicked",

"content": "<p>Spent 3 hours on middleware...</p>",

"tags": ["Node.js", "Auth"],

"mood": "💡",

"type": "breakthrough"

}

```

  

**Stats response:**

```json

{

"success": true,

"stats": {

"totalEntries": 12,

"currentStreak": 7,

"bestStreak": 14,

"skills": ["React", "Node.js", "MongoDB", "Auth"],

"aiSummaries": 0

}

}

```

  

---

  

## Key Design Decisions

  

**Why RTK Query over plain fetch?**

RTK Query handles caching automatically — if two components request the same data, only one network request is made. It also gives loading and error states for free.

  

**Why TipTap?**

TipTap is the most popular headless rich text editor for React. It supports full customisation of toolbar and styling while handling the complex contenteditable logic internally.

  

**Why JWT over sessions?**

JWT is stateless — the server stores no session data. Logout is handled entirely on the frontend by removing the token. This scales well and is simpler to deploy.

  

---

  

## Screenshots

<div align="center">

<img width="80%" alt="DevMind" src="https://github.com/user-attachments/assets/6dbc3706-ad5d-41b1-8ee2-6f0daf82733d" />
<br/><br/>
<img width="80%" alt="DevMindWriteEntry" src="https://github.com/user-attachments/assets/f23629d4-05d8-4526-8535-7438fda9ea2c" />


</div>

---

  

## Roadmap

  

- [x] User authentication (register / login / logout)

- [x] Rich text journal entries with TipTap

- [x] Tag and mood system

- [x] Dashboard with stats and streak grid

- [ ] AI entry summarisation

- [ ] Quiz mode from your own notes

- [ ] Semantic search with RAG

- [ ] Study planner agent

- [ ] Deployment (Render + Vercel)

  

---

  

## Author

  

**Riya** — Aspiring AI Engineer, currently building real projects to bridge the gap.

  

- GitHub: [@Riya1211](https://github.com/Riya1211)

- LinkedIn: [LinkedIn](https://www.linkedin.com/in/riya-rathore/)

  

---

  

<div  align="center">

<sub>Built with persistence. Bugs are features in disguise. 🚀</sub>

</div>
