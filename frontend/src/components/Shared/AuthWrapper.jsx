import { Navigate, Outlet } from "react-router-dom";
import React from "react";
import { jwtDecode } from "jwt-decode"; // Correct import

export const AuthWrapper = () => {
  const token = localStorage.getItem("token");
  return token ? <Outlet /> : <Navigate to="/login" />;
};

export const AdminWrapper = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = jwtDecode(token); // Decode token
    if (!user?.isAdmin) {
      return <Navigate to="/login" replace />;
    }
    return <Outlet />;
  } catch (error) {
    console.error("Invalid token:", error);
    return <Navigate to="/login" replace />;
  }
};
