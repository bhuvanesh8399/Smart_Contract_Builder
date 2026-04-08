import type { ReactNode } from "react";
import { Navigate, createBrowserRouter } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import CreateContract from "../pages/CreateContract";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import MyContracts from "../pages/MyContracts";
import Profile from "../pages/Profile";
import RiskAnalysis from "../pages/RiskAnalysis";
import Signup from "../pages/Signup";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Loading workspace...
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

export const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/dashboard" replace /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/create-contract",
    element: (
      <ProtectedRoute>
        <CreateContract />
      </ProtectedRoute>
    ),
  },
  {
    path: "/contracts",
    element: (
      <ProtectedRoute>
        <MyContracts />
      </ProtectedRoute>
    ),
  },
  {
    path: "/risk-analysis",
    element: (
      <ProtectedRoute>
        <RiskAnalysis />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
]);
