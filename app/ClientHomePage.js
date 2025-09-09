"use client";

import { AuthProvider } from "../contexts/AuthContext";
import { ToastProvider } from "@/contexts/ToastContext";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import Layout from "../components/dashboard/Layout";
import GymDashboard from "../components/dashboard/GymDashboard";

export default function ClientHomePage() {
  return (
    <ToastProvider>
      <AuthProvider>
        <ProtectedRoute allowedRoles={["ADMIN", "OWNER", "DUEÑO"]}>
          <Layout>
            <GymDashboard />
          </Layout>
        </ProtectedRoute>
      </AuthProvider>
    </ToastProvider>
  );
}
