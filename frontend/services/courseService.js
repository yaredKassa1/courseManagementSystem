import api from "./api";

export const getCourses = (params) => {
  return api.get("/api/courses", {
    params: {
      page: params.page,
      size: params.size,
      search: params.search,
      sortBy: params.sortBy,
      sortDir: params.sortDir,
    },
  });
};

export const createCourse = (data) => {
  return api.post("/api/courses", data);
};

export const updateCourse = (id, data) => {
  return api.put(`/api/courses/${id}`, data);
};

export const deleteCourse = (id) => {
  return api.delete(`/api/courses/${id}`);
};
