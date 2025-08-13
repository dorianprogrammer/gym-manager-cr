"use client";

import { AuthProvider } from "../contexts/AuthContext";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import Layout from "../components/dashboard/Layout";
import GymDashboard from "../components/dashboard/GymDashboard";
import { ToastProvider } from "@/contexts/ToastContext";

export default function ClientHomePage() {
  return (
    <ToastProvider>
      <AuthProvider>
        <ProtectedRoute>
          <Layout>
            <GymDashboard />
          </Layout>
        </ProtectedRoute>
      </AuthProvider>
    </ToastProvider>
  );
}
