"use client";

import { useEffect, useState } from "react";

import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import DataTable from "@/components/DataTable";
import Pagination from "@/components/Pagination";
import SearchInput from "@/components/SearchInput";
import FormModal from "@/components/FormModal";
import Loader from "@/components/Loader";
import ErrorMessage from "@/components/ErrorMessage";

import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  activateUser,
  deactivateUser,
  resetPassword,
  changeRole,
} from "@/services/userService";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [page, setPage] = useState(0);
  const [size] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("username");
  const [sortDir, setSortDir] = useState("asc");

  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "ROLE_USER",
  });

  useEffect(() => {
    fetchUsers();
  }, [page, search, sortBy, sortDir]);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await getUsers({
        page,
        size,
        search,
        sortBy,
        sortDir,
      });
      const usersArray = Array.isArray(res.data)
        ? res.data
        : res.data.data || [];

      setUsers(usersArray);
      setTotalPages(res.data.totalPages || 1);
    } catch {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedUser) {
      await updateUser(selectedUser.id, formData);
    } else {
      await createUser(formData);
    }

    setShowModal(false);
    fetchUsers();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this user?")) return;
    await deleteUser(id);
    fetchUsers();
  };

  const toggleStatus = async (user) => {
    if (user.enabled) {
      await deactivateUser(user.id);
    } else {
      await activateUser(user.id);
    }
    fetchUsers();
  };

  const handleResetPassword = async (id) => {
    if (!confirm("Reset password for this user?")) return;
    await resetPassword(id);
    alert("Password reset successfully");
  };

  return (
    <ProtectedRoute role="ROLE_ADMIN">
      <Navbar />

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">User Management</h1>

        <button
          onClick={() => {
            setSelectedUser(null);
            setFormData({
              username: "",
              password: "",
              role: "ROLE_USER",
            });
            setShowModal(true);
          }}
          className="bg-green-700 text-white px-4 py-2 rounded mb-4"
        >
          + Create User
        </button>

        {/* Search & Sort */}
        <div className="flex gap-3 mb-4">
          <SearchInput
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(0);
            }}
          />

          <select
            className="border p-2"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="username">Username</option>
            <option value="role">Role</option>
          </select>

          <select
            className="border p-2"
            value={sortDir}
            onChange={(e) => setSortDir(e.target.value)}
          >
            <option value="asc">ASC</option>
            <option value="desc">DESC</option>
          </select>
        </div>

        {loading && <Loader />}
        <ErrorMessage message={error} />

        {!loading && !error && (
          <>
            <DataTable
              columns={["Username", "Role", "Status"]}
              data={users.map((u) => ({
                Username: u.username,
                Role: u.role,
                Status: u.enabled ? "ACTIVE" : "INACTIVE",
              }))}
              renderActions={(row, index) => (
                <>
                  <button
                    className="text-blue-600 mr-2"
                    onClick={() => {
                      setSelectedUser(users[index]);
                      setFormData({
                        username: users[index].username,
                        password: "",
                        role: users[index].role,
                      });
                      setShowModal(true);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="text-yellow-600 mr-2"
                    onClick={() => toggleStatus(users[index])}
                  >
                    {users[index].enabled ? "Deactivate" : "Activate"}
                  </button>

                  <button
                    className="text-purple-600 mr-2"
                    onClick={() => handleResetPassword(users[index].id)}
                  >
                    Reset
                  </button>

                  <button
                    className="text-red-600"
                    onClick={() => handleDelete(users[index].id)}
                  >
                    Delete
                  </button>
                </>
              )}
            />

            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </div>

      <FormModal
        isOpen={showModal}
        title={selectedUser ? "Update User" : "Create User"}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
      >
        <input
          className="border p-2 w-full mb-3"
          placeholder="Username"
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
          required
        />

        {!selectedUser && (
          <input
            className="border p-2 w-full mb-3"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
        )}

        <select
          className="border p-2 w-full"
          value={formData.role}
          onChange={(e) =>
            setFormData({ ...formData, role: e.target.value })
          }
        >
          <option value="ROLE_USER">ROLE_USER</option>
          <option value="ROLE_ADMIN">ROLE_ADMIN</option>
        </select>
      </FormModal>
    </ProtectedRoute>
  );
}