import requests from "./httpService";

const AccesoriesServices = {
    // ✅ Create a new contact lens
    addAccesories: async (body) => {
        return requests.post("/accesories/", body);
    },

    // ✅ Get all contact lenses
    getAllAccesories: async () => {
        return requests.get("/accesories/");
    },

    // ✅ Get a specific contact lens by ID
    getAccesoriesById: async (id) => {
        return requests.get(`/accesories/${id}`);
    },

    // ✅ Update a contact lens
    updateAccesories: async (id, body) => {
        return requests.put(`/accesories/${id}`, body);
    },

    // ✅ Delete a contact lens
    deleteAccesories: async (id) => {
        return requests.delete(`/accesories/${id}`);
    },
};

export default AccesoriesServices;