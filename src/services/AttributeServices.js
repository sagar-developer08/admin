import requests from "./httpService";

const AttributeServices = {
  getAllAttributes: async () => {
    return requests.get(`/brands/all`);
  },

  getShowingAttributes: async (body) => {
    return requests.get("/brands/show", body);
  },

  addAttribute: async (body) => {
    return requests.post("/brands/add", body);
  },

  addChildAttribute: async (id, body) => {
    return requests.put(`/brands/add/child/${id}`, body);
  },

  addAllAttributes: async (body) => {
    return requests.post("/brands/add/all", body);
  },

  getAttributeById: async (id) => {
    return requests.get(`/brands/${id}`);
  },

  getChildAttributeById: async ({ id, ids }) => {
    return requests.get(`/brands/child/${id}/${ids}`);
  },

  updateAttributes: async (id, body) => {
    return requests.put(`/brands/${id}`, body);
  },

  updateChildAttributes: async ({ id, ids }, body) => {
    return requests.put(`/brands/update/child/${ids}/${id}`, body);
  },

  updateStatus: async (id, body) => {
    return requests.put(`/brands/status/${id}`, body);
  },

  updateChildStatus: async (id, body) => {
    return requests.put(`/brands/status/child/${id}`, body);
  },

  deleteAttribute: async (id, body) => {
    return requests.delete(`/brands/${id}`, body);
  },

  deleteChildAttribute: async ({ id, ids }, body) => {
    return requests.put(`/brands/delete/child/${ids}/${id}`, body);
  },

  updateManyAttribute: async (body) => {
    return requests.patch("/brands/update/many", body);
  },

  updateManyChildAttribute: async (body) => {
    return requests.patch("/brands/update/child/many", body);
  },

  deleteManyAttribute: async (body) => {
    return requests.patch("/brands/delete/many", body);
  },

  deleteManyChildAttribute: async (body) => {
    return requests.patch("/brands/delete/child/many", body);
  },
};

export default AttributeServices;
