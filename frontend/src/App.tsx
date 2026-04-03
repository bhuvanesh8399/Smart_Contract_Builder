import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./app/layout/AppShell";
import GuestOnlyRoute from "./components/GuestOnlyRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import CreateContractPage from "./pages/CreateContractPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import MyContractsPage from "./pages/MyContractsPage";
import ProfilePage from "./pages/ProfilePage";
import RiskAnalysisPage from "./pages/RiskAnalysisPage";
import SignupPage from "./pages/SignupPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              <GuestOnlyRoute>
                <LoginPage />
              </GuestOnlyRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <GuestOnlyRoute>
                <SignupPage />
              </GuestOnlyRoute>
            }
          />

          <Route
            element={
              <ProtectedRoute>
                <AppShell />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/create-contract" element={<CreateContractPage />} />
            <Route path="/my-contracts" element={<MyContractsPage />} />
            <Route path="/risk-analysis" element={<RiskAnalysisPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
