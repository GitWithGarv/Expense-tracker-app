import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Loader from "./components/Shared/index.jsx";
import ProtectedRoute from "./components/ProtectedRoute";

const Homepage = lazy(() => import("./components/Home"));
const SignUp = lazy(() => import("./components/Home/Signup/index.jsx"));
const PageNotFound = lazy(() => import("./components/PageNotFound"));
const UserLayout = lazy(() => import("./components/User/UserLayout"));
const AdminLayout = lazy(() => import("./components/Admin/AdminLayout"));
const ForgotPassword = lazy(() => import("./components/Home/ForgotPassword"));
const Dashboard = lazy(() => import("./components/shared/Dashboard/index.jsx"));
const Report = lazy(() => import("./components/shared/Report/index.jsx"));
const Transactions = lazy(() => import("./components/shared/Transactions/index.jsx"));

const App = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        //Admin related routes
        <Route
          path="/app/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="report" element={<Report />} />
          <Route path="transactions" element={<Transactions />} />
        </Route>

        // User realted routes
        <Route
          path="/app/user"
          element={
            <ProtectedRoute>
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="report" element={<Report />} />
          <Route path="transactions" element={<Transactions />} />
        </Route>

        <Route path="*" element={<PageNotFound />} />
      </Routes>

      <ToastContainer />
    </Suspense>
  );
};

export default App;
