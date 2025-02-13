import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import LoginForm from "../features/auth/components/LoginForm";
import RegisterForm from "../features/auth/components/RegisterForm";
import HomePage from "../features/home/components/Index";
import LandingPage from "../features/landingpage/components/Index";
import { ProtectedRoute } from "./ProtectedRoute";
import { useAuth } from "../features/auth/context/AuthContext";

const AppRoute = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/home" replace /> : <LandingPage />}
        />
        <Route
          path="/login"
          element={user ? <Navigate to="/home" replace /> : <LoginForm />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/home" replace /> : <RegisterForm />}
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoute;
