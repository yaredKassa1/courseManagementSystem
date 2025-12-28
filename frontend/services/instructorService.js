import api from "./api";

export const getInstructors = (params) => {
  return api.get("/api/instructors", {
    params: {
      page: params.page,
      size: params.size,
      search: params.search,
      sortBy: params.sortBy,
      sortDir: params.sortDir,
    },
  });
};

export const createInstructor = (data) => {
  return api.post("/api/instructors", data);
};

export const updateInstructor = (id, data) => {
  return api.put(`/api/instructors/${id}`, data);
};

export const deleteInstructor = (id) => {
  return api.delete(`/api/instructors/${id}`);
};
