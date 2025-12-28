import api from "./api";

export const getDepartments = (params) => {
  return api.get("/api/departments", {
    params: {
      page: params.page,
      size: params.size,
      search: params.search,
      sortBy: params.sortBy,
      sortDir: params.sortDir,
    },
  });
};

export const createDepartment = (data) => {
  return api.post("/api/departments", data);
};

export const updateDepartment = (id, data) => {
  return api.put(`/api/departments/${id}`, data);
};

export const deleteDepartment = (id) => {
  return api.delete(`/api/departments/${id}`);
};
