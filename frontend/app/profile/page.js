"use client";
import { useEffect, useState } from "react";
import api from "@/services/api";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function ProfilePage() {
  const [profile, setProfile] = useState({ fullName: "", email: "", studentNumber: "" });
  const [password, setPassword] = useState(""); // State for new password

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/api/student/profile");
        setProfile(res.data);
      } catch (err) { console.error(err); }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      // Send both email and password to the backend
      await api.put(`/api/student/profile/update`, {
        email: profile.email,
        password: password 
      });
      alert("Profile updated! If you changed your password, please log in again next time.");
      setPassword(""); // Clear password field after success
    } catch (err) {
      alert("Error updating profile.");
    }
  };

  return (
    <ProtectedRoute allowedRoles={["ROLE_USER"]}>
      <div className="p-9 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">👤 My Profile</h1>
        <form onSubmit={handleUpdate} className="bg-white p-8 rounded-xl shadow-md max-w-lg border border-gray-100">
          
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2 text-sm uppercase">Full Name</label>
            <input className="w-full border p-3 rounded bg-gray-100 cursor-not-allowed text-gray-500" value={profile.fullName} disabled />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2 text-sm uppercase">Email Address</label>
            <input 
              type="email"
              className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-400 outline-none" 
              value={profile.email} 
              onChange={(e) => setProfile({...profile, email: e.target.value})}
              required
            />
          </div>

          <div className="mb-6 border-t pt-4">
            <label className="block text-red-600 font-bold mb-2 text-sm uppercase">Change Password</label>
            <input 
              type="password"
              placeholder="Leave blank to keep current password"
              className="w-full border p-3 rounded focus:ring-2 focus:ring-red-300 outline-none" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition shadow-lg">
            Save Changes
          </button>
        </form>
      </div>
    </ProtectedRoute>
  );
}