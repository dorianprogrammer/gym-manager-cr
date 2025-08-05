"use client";

import { AuthProvider } from "../contexts/AuthContext";
import ProtectedRoute from "../components/ProtectedRoute";
import Layout from "../components/Layout";
import GymDashboard from "../components/GymDashboard";

export default function Home() {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <Layout>
          <GymDashboard />
        </Layout>
      </ProtectedRoute>
    </AuthProvider>
  );
}
