import requests from "./httpService";

const ProductServices = {
  getAllProducts: async ({ page, limit, category, title, price }) => {
    const searchCategory = category !== null ? category : "";
    const searchTitle = title !== null ? title : "";
    const searchPrice = price !== null ? price : "";

    return requests.get(
      `/products?page=${page}&limit=${limit}&category=${searchCategory}&title=${searchTitle}&price=${searchPrice}`
    );
  },

  getProductById: async (id) => {
    return requests.post(`/products/${id}`);
  },
  addProduct: async (body) => {
    // For FormData, don't set Content-Type header as it will be set automatically with boundary
    return requests.post("/products/add", body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  addAllProducts: async (body) => {
    return requests.post("/products/all", body);
  },
  updateProduct: async (id, body) => {
    // For FormData, don't set Content-Type header as it will be set automatically with boundary
    return requests.patch(`/products/${id}`, body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  updateManyProducts: async (body) => {
    return requests.patch("products/update/many", body);
  },
  updateStatus: async (id, body) => {
    return requests.put(`/products/status/${id}`, body);
  },

  deleteProduct: async (id) => {
    return requests.delete(`/products/${id}`);
  },
  deleteManyProducts: async (body) => {
    return requests.patch("/products/delete/many", body);
  },

  reorderImages: async (productId, reordered_images) => {
    try {
      return await requests.patch(`/products/${productId}/reorder-images`, { reordered_images });
    } catch (error) {
      console.error('Error in reorderImages:', error);
      throw error; // Re-throw to allow component-level handling
    }
  },
};

export default ProductServices;
