import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { DarkModeProvider } from "./context/DarkModeContext";
import { NotificationProvider } from "./context/NotificationContext";
import { LanguageProvider } from "./context/LanguageContext";
import { ProtectedRoute, AdminRoute } from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";
import BackToTop from "./components/BackToTop";
import ScrollProgressBar from "./components/ScrollProgressBar";
import SessionTimeout from "./components/SessionTimeout";


import Home            from "./pages/Home";
import PackageList     from "./pages/PackageList";
import PackageDetails  from "./pages/PackageDetails";
import Login           from "./pages/Login";
import Register        from "./pages/Register";
import ForgotPassword  from "./pages/ForgotPassword";
import TourHistory     from "./pages/TourHistory";
import Profile         from "./pages/Profile";
import ChangePassword  from "./pages/ChangePassword";
import Enquiry         from "./pages/Enquiry";
import IssueTickets    from "./pages/IssueTickets";
import NotFound        from "./pages/NotFound";
import About           from "./pages/About";
import FAQ             from "./pages/FAQ";
import Contact         from "./pages/Contact";
import Privacy         from "./pages/Privacy";
import Terms           from "./pages/Terms";

import AdminLogin           from "./pages/admin/AdminLogin";
import Dashboard            from "./pages/admin/Dashboard";
import ManageBookings       from "./pages/admin/ManageBookings";
import ManagePackages       from "./pages/admin/ManagePackages";
import CreatePackage        from "./pages/admin/CreatePackage";
import UpdatePackage        from "./pages/admin/UpdatePackage";
import ManageUsers          from "./pages/admin/ManageUsers";
import ManageEnquiries      from "./pages/admin/ManageEnquiries";
import ManageIssues         from "./pages/admin/ManageIssues";
import AdminProfile         from "./pages/admin/AdminProfile";
import AdminChangePassword  from "./pages/admin/AdminChangePassword";

export default function App() {
  return (
    <DarkModeProvider>
    <AuthProvider>
      <LanguageProvider>
      <ToastProvider>
        <NotificationProvider>
        <BrowserRouter>
          <ScrollProgressBar />
          <ScrollToTop />
          <BackToTop />
          <SessionTimeout />
          <Routes>
            <Route path="/"               element={<Home />} />
            <Route path="/packages"       element={<PackageList />} />
            <Route path="/packages/:id"   element={<PackageDetails />} />
            <Route path="/login"          element={<Login />} />
            <Route path="/register"       element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route path="/enquiry"        element={<Enquiry />} />
            <Route path="/about"          element={<About />} />
            <Route path="/faq"            element={<FAQ />} />
            <Route path="/contact"        element={<Contact />} />
            <Route path="/privacy"        element={<Privacy />} />
            <Route path="/terms"          element={<Terms />} />

            <Route path="/tour-history"    element={<ProtectedRoute><TourHistory /></ProtectedRoute>} />
            <Route path="/profile"         element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
            <Route path="/issue-tickets"   element={<ProtectedRoute><IssueTickets /></ProtectedRoute>} />

            <Route path="/admin"                    element={<AdminLogin />} />
            <Route path="/admin-login"              element={<AdminLogin />} />
            <Route path="/admin/login"              element={<AdminLogin />} />
            <Route path="/admin/dashboard"          element={<AdminRoute><Dashboard /></AdminRoute>} />
            <Route path="/admin/manage-bookings"    element={<AdminRoute><ManageBookings /></AdminRoute>} />
            <Route path="/admin/manage-packages"    element={<AdminRoute><ManagePackages /></AdminRoute>} />
            <Route path="/admin/create-package"     element={<AdminRoute><CreatePackage /></AdminRoute>} />
            <Route path="/admin/update-package/:id" element={<AdminRoute><UpdatePackage /></AdminRoute>} />
            <Route path="/admin/manage-users"       element={<AdminRoute><ManageUsers /></AdminRoute>} />
            <Route path="/admin/manage-enquiries"   element={<AdminRoute><ManageEnquiries /></AdminRoute>} />
            <Route path="/admin/manage-issues"      element={<AdminRoute><ManageIssues /></AdminRoute>} />
            <Route path="/admin/profile"            element={<AdminRoute><AdminProfile /></AdminRoute>} />
            <Route path="/admin/change-password"    element={<AdminRoute><AdminChangePassword /></AdminRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </NotificationProvider>
      </ToastProvider>
      </LanguageProvider>
    </AuthProvider>
    </DarkModeProvider>
  );
}
