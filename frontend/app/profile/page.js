"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import api from "@/services/api";

export default function ProfilePage() {
  const [profile, setProfile] = useState({});
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await api.get("/api/students/me"); // ✅ backend endpoint
      setProfile(res.data);
    };
    fetchProfile();
  }, []);

  const handlePasswordUpdate = async () => {
    await api.patch("/api/password", { password: newPassword });
    alert("Password updated successfully!");
    setNewPassword("");
  };

  return (
    <ProtectedRoute allowedRoles={["ROLE_USER"]}>
      <div className="p-8 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">👤 Profile</h1>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <p>
            <strong>Username:</strong> {profile.username}
          </p>
          <p>
            <strong>Role:</strong> {profile.role}
          </p>
          <p>
            <strong>Status:</strong> {profile.enabled ? "Active" : "Inactive"}
          </p>
        </div>

        <div className="mt-6 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Update Password</h2>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New Password"
            className="border p-2 w-full mb-4"
          />
          <button
            onClick={handlePasswordUpdate}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Update Password
          </button>
        </div>
      </div>
    </ProtectedRoute>
  );
}