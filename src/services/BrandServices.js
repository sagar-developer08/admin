import requests from "./httpService";

const BrandServices = {
  getAllBrands: async () => {
    return requests.get(`/brands/all`);
  },

  getBrandById: async (id) => {
    return requests.get(`/brands/${id}`);
  },

  getBrandBySlug: async (slug) => {
    return requests.post(`/brands/slug`, { slug });
  },

  addBrand: async (body) => {
    // For FormData, don't set Content-Type header as it will be set automatically with boundary
    return requests.post("/brands/add", body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  updateBrand: async (id, body) => {
    // For FormData, don't set Content-Type header as it will be set automatically with boundary
    return requests.put(`/brands/${id}`, body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  deleteBrand: async (id) => {
    return requests.delete(`/brands/${id}`);
  },

  deleteManyBrands: async (body) => {
    return requests.patch("/brands/delete/many", body);
  },

  updateManyBrands: async (body) => {
    return requests.patch("/brands/update/many", body);
  },
};

export default BrandServices;
