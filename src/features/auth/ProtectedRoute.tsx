// src/features/auth/ProtectedRoute.tsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
