"use client";

import React, { useState } from "react";
import { registerAdmin } from "../lib/auth";

export default function CreateAdminAccount() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const createAdmin = async () => {
    console.log("🔄 Creating admin account...");
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const adminEmail = "admin@gimnasio.com";
      const adminPassword = "admin123";

      console.log("📧 Attempting to create admin with email:", adminEmail);

      const result = await registerAdmin(adminEmail, adminPassword);

      console.log("🔍 Registration result:", result);

      if (result.success) {
        setMessage(`✅ ¡Admin creado exitosamente! 
        
📧 Email: ${adminEmail}
🔒 Password: ${adminPassword}

Ahora puedes hacer login con estas credenciales.`);
        console.log("✅ Admin account created successfully!");
      } else {
        setError(`❌ Error al crear admin: ${result.error}`);
        console.error("❌ Failed to create admin:", result.error);
      }
    } catch (error) {
      const errorMsg = `❌ Error inesperado: ${error.message}`;
      setError(errorMsg);
      console.error("❌ Unexpected error:", error);
    }

    setLoading(false);
  };

  // Test button click without Firebase first
  const testClick = () => {
    console.log("🧪 Test button clicked!");
    alert("¡Botón funciona! Ahora probando Firebase...");
    createAdmin();
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg border">
      <h2 className="text-xl font-bold mb-4 text-center">🔑 Create Admin Account</h2>

      <p className="text-gray-600 text-sm mb-4 text-center">
        Run this <strong>once</strong> to create your first admin account for the gym system.
      </p>

      {/* Test Button First */}
      <button
        onClick={testClick}
        disabled={loading}
        className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-4 font-medium"
        style={{ cursor: loading ? "not-allowed" : "pointer" }}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
            Creating Admin...
          </div>
        ) : (
          "🚀 Create Admin Account"
        )}
      </button>

      {/* Alternative Manual Button */}
      <button
        onClick={() => {
          console.log("Manual button clicked");
          setMessage("Manual button works! Check console.");
        }}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded mb-4"
      >
        🧪 Test Button (Manual)
      </button>

      {/* Success Message */}
      {message && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <pre className="text-sm text-green-700 whitespace-pre-wrap">{message}</pre>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Expected Credentials */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-800 font-medium">Credentials to be created:</p>
        <p className="text-xs text-blue-700">
          📧 Email: admin@gimnasio.com
          <br />
          🔒 Password: admin123
        </p>
      </div>

      {/* Debug Info */}
      <div className="mt-4 p-3 bg-gray-50 border rounded-lg">
        <p className="text-xs text-gray-600 font-medium">Debug Info:</p>
        <p className="text-xs text-gray-500">
          • Check browser console for logs
          <br />
          • Make sure Firebase config is correct
          <br />• Verify Firestore is enabled in Firebase Console
        </p>
      </div>
    </div>
  );
}
