import React from "react";
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";

// Import Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar"; // <-- Added Sidebar import

// Import Pages
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import PostJob from "./pages/PostJob";
import JobFeed from "./pages/JobFeed";
import ApplyJob from "./pages/ApplyJob";
import ViewApplications from "./pages/ViewApplications";
import MyApplications from "./pages/MyApplications";
import Profile from './pages/Profile';
import Messages from './pages/Messages';

// --- NEW: Master Layout for Authenticated Pages ---
// This permanently pins the Sidebar to the left and injects the page content on the right
const SidebarLayout = () => {
  return (
    <div className="container-fluid bg-light min-vh-100">
      <div className="row min-vh-100">
        {/* Sidebar Column */}
        <div className="col-md-3 col-lg-2 p-0 d-none d-md-block border-end bg-white">
          <Sidebar />
        </div>
        
        {/* Main Content Column */}
        <div className="col-md-9 col-lg-10 p-4 p-lg-5">
          <Outlet /> {/* This dynamically loads the Dashboard, Jobs, or Profile here! */}
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100 fade-in">
        {/* Navbar stays at the top of every page */}
        <Navbar />

        <main className="flex-grow-1">
          <Routes>
            {/* --- PUBLIC ROUTES (No Sidebar) --- */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            

            {/* --- AUTHENTICATED ROUTES (With Sidebar) --- */}
            <Route element={<SidebarLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/post-job" element={<PostJob />} />
              <Route path="/jobs" element={<JobFeed />} />
              <Route path="/apply/:jobId" element={<ApplyJob />} />
              <Route path="/applications/job/:jobId" element={<ViewApplications />} />
              <Route path="/my-applications" element={<MyApplications />} />
              <Route path="/messages" element={<Messages />} />
            </Route>
          </Routes>
        </main>

        {/* Footer stays at the bottom of every page */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;