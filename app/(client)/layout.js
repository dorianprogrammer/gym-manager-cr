"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/contexts/ToastContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Layout from "@/components/dashboard/Layout";

export default function ClientLayout({ children }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <ProtectedRoute allowedRoles={["ADMIN", "OWNER"]}>
          <Layout>{children}</Layout>
        </ProtectedRoute>
      </AuthProvider>
    </ToastProvider>
  );
}
