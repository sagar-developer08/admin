import requests from "./httpService";

const StoreServices = {

    getAllStores: async () => {
        return requests.get(`/stores/`);
    },
    

    getStoreById: async (id) => {
        return requests.get(`/stores/${id}`);
    },

    createStore: async (body) => {
        return requests.post("/stores/", body);
    },

    updateStore: async (id, body) => {
        return requests.put(`/stores/${id}`, body);
    },

    deleteStore: async (id) => {
        return requests.delete(`/stores/${id}`);
    },
};

export default StoreServices;