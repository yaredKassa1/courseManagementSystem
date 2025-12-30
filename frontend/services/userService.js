import api from "./api";

export const getUsers = (params) => {
  return api.get("/admin/users", {
    params: {
      page: params.page,
      size: params.size,
      search: params.search,
      sortBy: params.sortBy,
      sortDir: params.sortDir,
    },
  });
};

export const createUser = (data) =>
  api.post("/admin/users", data);

export const updateUser = (id, data) =>
  api.put(`/admin/users/${id}`, data);

export const deleteUser = (id) =>
  api.delete(`/admin/users/${id}`);

export const activateUser = (id) =>
  api.patch(`/admin/users/${id}/activate`);

export const deactivateUser = (id) =>
  api.patch(`/admin/users/${id}/deactivate`);

export const resetPassword = (id) =>
  api.patch(`/admin/users/${id}/reset-password`);

export const changeRole = (id, role) =>
  api.patch(`/admin/users/${id}/role`, { role });