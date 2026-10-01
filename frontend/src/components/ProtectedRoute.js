import React, { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Api from "../api/Api";

export default function ProtectedRoute({ allowedRoles = [], children }) {
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("id");
  const params = useParams();

  const userRoleLower = role ? role.toLowerCase() : null;
  const isAuthorizedRole = userRoleLower && allowedRoles.map((r) => r.toLowerCase()).includes(userRoleLower);

  const isCaretakerIdTampered =
    userRoleLower === "caretaker" &&
    params.id &&
    userId &&
    params.id.toString() !== userId.toString();

  const isUnauthorized = !isAuthorizedRole || isCaretakerIdTampered;

  useEffect(() => {
    if (isUnauthorized) {
      toast.error("Unauthorized. Please login again.");
      localStorage.removeItem("role");
      localStorage.removeItem("id");
      localStorage.removeItem("token");
      axios.post(Api.logout).catch(() => {});
    }
  }, [isUnauthorized]);

  if (isUnauthorized) {
    return <Navigate to="/" replace />;
  }

  return children;
}
