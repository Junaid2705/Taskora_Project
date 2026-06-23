import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Import Pages
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import UserProfile from "./pages/UserProfile";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import PostJob from "./pages/PostJob";
import JobFeed from "./pages/JobFeed";
import ApplyJob from "./pages/ApplyJob";
import ViewApplications from "./pages/ViewApplications";
import MyApplications from "./pages/MyApplications";
import Profile from './pages/Profile';
function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        {/* Navbar stays at the top of every page */}
        <Navbar />

        {/* Main Content Area */}
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/post-job" element={<PostJob />} />
            <Route path="/jobs" element={<JobFeed />} />
            <Route path="/apply/:jobId" element={<ApplyJob />} />
            <Route path="/profile" element={<Profile />} />
            <Route
              path="/applications/job/:jobId"
              element={<ViewApplications />}
            />
            <Route path="/my-applications" element={<MyApplications />} />
          </Routes>
        </main>

        {/* Footer stays at the bottom of every page */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
