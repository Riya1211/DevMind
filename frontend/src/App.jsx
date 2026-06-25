import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Sidebar from "./components/Sidebar.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AllEntries from "./pages/AllEntries.jsx";
import AIChatPage from "./pages/AIChatPage.jsx";
import WriteEntry from "./pages/WriteEntry.jsx";
import Register from "./pages/Register.jsx";
import QuizMePage from "./pages/QuizMePage.jsx";


// Protected wrapper — if no token, redirect to login
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" />;
  return children;
}

// Layout wrapper — sidebar + page content
function AppLayout() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 ml-56 overflow-y-auto scroll-smooth">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/entries" element={<AllEntries />} />
          <Route path="/chat" element={<AIChatPage />} />
          <Route path="/write" element={<WriteEntry />} />
          <Route path="/write/:id" element={<WriteEntry />} />
          <Route path="/quiz" element={<QuizMePage />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <>
      <Routes>
        {/* Public routes — no auth needed */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes — need token */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
