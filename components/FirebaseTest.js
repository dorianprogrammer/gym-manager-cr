"use client";

import React, { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";

export default function FirebaseTest() {
  const [status, setStatus] = useState("testing");
  const [testData, setTestData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    testFirebaseConnection();
  }, []);

  const testFirebaseConnection = async () => {
    try {
      setStatus("connecting");

      const querySnapshot = await getDocs(collection(db, "gym_test"));

      setStatus("connected");

      // Load any existing test data
      const docs = [];
      querySnapshot.forEach((doc) => {
        docs.push({ id: doc.id, ...doc.data() });
      });
      setTestData(docs);
    } catch (error) {
      setStatus("error");
      console.error("❌ Firebase connection failed:", error);
      console.error("Check your Firebase config in lib/firebase.js");
    }
  };

  const addTestGymData = async () => {
    setLoading(true);
    try {
      // Add a test gym member
      const docRef = await addDoc(collection(db, "gym_test"), {
        type: "test_member",
        name: "Juan Pérez (Test)",
        email: "juan.test@gym.cr",
        membershipType: "monthly",
        joinDate: serverTimestamp(),
        country: "Costa Rica",
        testNumber: Math.floor(Math.random() * 1000),
      });

      console.log("✅ Test document added with ID:", docRef.id);

      // Reload test data
      await testFirebaseConnection();
    } catch (error) {
      console.error("❌ Error adding test document:", error);
      alert("Error: " + error.message);
    }
    setLoading(false);
  };

  const clearTestData = async () => {
    // We'll implement this later if needed
    alert("Test data clearing - implement if needed");
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">🔥 Firebase Connection Test</h1>
          <p className="text-gray-600">Testing connection to your Costa Rica gym database</p>
        </div>

        {/* Connection Status */}
        <div className="mb-8">
          <div className="flex items-center justify-center p-6 rounded-lg border-2 border-dashed">
            {status === "testing" && (
              <div className="text-center">
                <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">Testing Firebase connection...</p>
              </div>
            )}

            {status === "connecting" && (
              <div className="text-center">
                <div className="animate-pulse w-8 h-8 bg-yellow-400 rounded-full mx-auto mb-4"></div>
                <p className="text-yellow-600 font-medium">Connecting to Firebase...</p>
              </div>
            )}

            {status === "connected" && (
              <div className="text-center">
                <div className="w-8 h-8 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-xl">✓</span>
                </div>
                <p className="text-green-600 font-medium text-lg">✅ Firebase Connected Successfully!</p>
                <p className="text-sm text-gray-500 mt-1">Ready to build your gym management system</p>
              </div>
            )}

            {status === "error" && (
              <div className="text-center">
                <div className="w-8 h-8 bg-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-xl">✗</span>
                </div>
                <p className="text-red-600 font-medium text-lg">❌ Firebase Connection Failed</p>
                <p className="text-sm text-gray-500 mt-1">Check your Firebase config keys</p>
              </div>
            )}
          </div>
        </div>

        {/* Test Actions */}
        {status === "connected" && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">🧪 Test Firebase Operations</h3>
            <div className="flex gap-4 justify-center">
              <button
                onClick={addTestGymData}
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {loading ? "Adding..." : "📝 Add Test Gym Member"}
              </button>

              <button
                onClick={testFirebaseConnection}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                🔄 Refresh Data
              </button>
            </div>
          </div>
        )}

        {/* Test Data Display */}
        {testData.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              📊 Test Data in Firebase Firestore ({testData.length} documents)
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
              {testData.map((doc, index) => (
                <div key={doc.id} className="bg-white p-4 rounded border mb-3 last:mb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-800">{doc.name}</p>
                      <p className="text-sm text-gray-600">{doc.email}</p>
                      <p className="text-xs text-gray-500">
                        Membership: {doc.membershipType} | Test #{doc.testNumber}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">ID: {doc.id.substring(0, 8)}...</p>
                      <p className="text-xs text-gray-400">
                        {doc.joinDate?.toDate?.()?.toLocaleDateString() || "No date"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-800 mb-3">📋 Next Steps:</h3>
          <ol className="text-sm text-blue-700 space-y-2">
            <li className="flex items-center">
              <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold mr-3">
                1
              </span>
              Make sure you've replaced the Firebase config in{" "}
              <code className="bg-blue-100 px-1 rounded">lib/firebase.js</code>
            </li>
            <li className="flex items-center">
              <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold mr-3">
                2
              </span>
              Verify your Firestore database is in "test mode" in Firebase Console
            </li>
            <li className="flex items-center">
              <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold mr-3">
                3
              </span>
              If this works, we're ready to build the real gym features! 🚀
            </li>
          </ol>
        </div>

        {/* Error Help */}
        {status === "error" && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="font-semibold text-red-800 mb-3">🔧 Troubleshooting:</h3>
            <ul className="text-sm text-red-700 space-y-1">
              <li>
                • Check that your Firebase config keys are correct in <code>lib/firebase.js</code>
              </li>
              <li>• Make sure Firestore is enabled in your Firebase project</li>
              <li>• Verify your Firebase project is in "test mode" for Firestore rules</li>
              <li>• Check the browser console for detailed error messages</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
