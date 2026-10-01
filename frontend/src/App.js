import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import SignUp from "./components/SignUp";
import Login from "./components/Login";
import DaysReport from "./components/DaysReport";
import Admin from "./components/Admin";
import DriverDashboard from "./components/DriverDashboard";
import SupervisorDashboard from "./components/SupervisorDashboard";
import DriverRoute from "./components/DriverRoute";
import DriverCompletedTask from "./components/DriverCompletedTask";
import AssignLocation from "./components/AssignLocation";
import LocationCreatedashboard from "./components/LocationCreatedashboard";
import ShowAllLocations from "./components/ShowAllLocations";
import AdminRequestsDashboard from "./components/AdminRequestsDashboard";
import CareTakerDashboard from "./components/CareTakerDashboard";
import SuperCareTakerReq from "./components/SuperCareTakerReq";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <Routes>
        {/* PUBLIC ROUTE */}
        <Route path="/" element={<Login />} />

        {/* ADMIN ROUTES */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-account"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <SignUp />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-location"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <LocationCreatedashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-location/:id"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <LocationCreatedashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/see-all-locations"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ShowAllLocations />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assign-location"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AssignLocation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/days-report"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <DaysReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/see-all-req-admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminRequestsDashboard />
            </ProtectedRoute>
          }
        />

        {/* SUPERVISOR ROUTES */}
        <Route
          path="/supervisor-dashboard"
          element={
            <ProtectedRoute allowedRoles={["supervisor"]}>
              <SupervisorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/caretaker-requests"
          element={
            <ProtectedRoute allowedRoles={["supervisor"]}>
              <SuperCareTakerReq />
            </ProtectedRoute>
          }
        />

        {/* CARETAKER ROUTES */}
        <Route
          path="/caretaker/:id"
          element={
            <ProtectedRoute allowedRoles={["caretaker"]}>
              <CareTakerDashboard />
            </ProtectedRoute>
          }
        />

        {/* DRIVER ROUTES */}
        <Route
          path="/driver-dashboard"
          element={
            <ProtectedRoute allowedRoles={["driver"]}>
              <DriverDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/driver-route/:id"
          element={
            <ProtectedRoute allowedRoles={["driver"]}>
              <DriverRoute />
            </ProtectedRoute>
          }
        />
        <Route
          path="/driver-completed-tasks"
          element={
            <ProtectedRoute allowedRoles={["driver"]}>
              <DriverCompletedTask />
            </ProtectedRoute>
          }
        />

        {/* CATCH-ALL UNKNOWN ROUTE -> HOMESCREEN */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="colored"
        newestOnTop
        closeOnClick
        pauseOnHover
      />

    </>
  );
}

export default App;