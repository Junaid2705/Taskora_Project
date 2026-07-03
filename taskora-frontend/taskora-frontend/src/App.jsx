import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import AppLayout from "./components/AppLayout";
import AdminLayout from "./components/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";

// Public pages
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// App pages
import Dashboard from "./pages/Dashboard";
import JobFeed from "./pages/JobFeed";
import JobDetails from "./pages/JobDetails";
import PostJob from "./pages/employer/PostJob";
import ApplyJob from "./pages/freelancer/ApplyJob";
import MyApplications from "./pages/freelancer/MyApplications";
import MyJobs from "./pages/employer/MyJobs";
import ViewApplications from "./pages/employer/ViewApplications";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import PostProject from "./pages/employer/PostProject";
import MyBids from "./pages/freelancer/MyBids";
import Profile from "./pages/Profile";
import Messages from "./pages/Messages";
import Feed from "./pages/Feed";
import Notifications from "./pages/Notifications";
import Search from "./pages/Search";
import Subscriptions from "./pages/Subscriptions";
import PortfolioPage from "./pages/PortfolioPage";

// Creator pages
import CreatorDashboard from "./pages/creator/CreatorDashboard";
import CreatorPlan from "./pages/creator/CreatorPlan";
import CreatorSubscribers from "./pages/creator/CreatorSubscribers";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminJobs from "./pages/admin/AdminJobs";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminPlaceholder from "./pages/admin/AdminPlaceholder";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminReports from "./pages/admin/AdminReports";
import AdminSubscriptions from "./pages/admin/AdminSubscriptions";
import AdminApplications from "./pages/admin/AdminApplications";
import AdminCms from "./pages/admin/AdminCms";
import AdminPosts from "./pages/admin/AdminPosts";

// Extra pages
import ReportUser from "./pages/ReportUser";
import CmsPage from "./pages/CmsPage";

import { hasRole } from "./services/auth";

// Admin guard — wraps admin routes
const AdminRoute = ({ children }) => {
  if (!hasRole('ADMIN')) return <Navigate to="/dashboard" replace />;
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/page/:slug" element={<CmsPage />} />

        {/* Authenticated app (sidebar + topbar + mobile nav) */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/my-portfolio" element={<PortfolioPage />} />
          <Route path="/search" element={<Search />} />
          <Route path="/jobs" element={<JobFeed />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/post-job" element={<PostJob />} />
          <Route path="/apply/:jobId" element={<ApplyJob />} />
          <Route path="/my-applications" element={<MyApplications />} />
          <Route path="/my-jobs" element={<MyJobs />} />
          <Route path="/applications/job/:jobId" element={<ViewApplications />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
          <Route path="/post-project" element={<PostProject />} />
          <Route path="/my-bids" element={<MyBids />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/report" element={<ReportUser />} />
          <Route path="/creator-dashboard" element={<CreatorDashboard />} />
          <Route path="/creator-plan" element={<CreatorPlan />} />
          <Route path="/creator-subscribers" element={<CreatorSubscribers />} />
        </Route>

        {/* Admin panel */}
        <Route
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            </ProtectedRoute>
          }
        >
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/jobs" element={<AdminJobs />} />
          <Route path="/admin/projects" element={<AdminProjects />} />
          <Route path="/admin/posts" element={<AdminPosts />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/admin/subscriptions" element={<AdminSubscriptions />} />
          <Route path="/admin/applications" element={<AdminApplications />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/cms" element={<AdminCms />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
