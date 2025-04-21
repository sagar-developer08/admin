import requests from "./httpService";

const ContactLensServices = {
    // ✅ Create a new contact lens
    addContactLens: async (body) => {
        return requests.post("/contactlens/addcontactlens", body);
    },

    // ✅ Get all contact lenses
    getAllContactLenses: async () => {
        return requests.get("/contactlens/");
    },

    // ✅ Get a specific contact lens by ID
    getContactLensById: async (id) => {
        return requests.get(`/contactlens/getcontactlens/${id}`);
    },

    // ✅ Update a contact lens
    updateContactLens: async (id, body) => {
        return requests.put(`/contactlens/updatecontactlens/${id}`, body);
    },

    // ✅ Delete a contact lens
    deleteContactLens: async (id) => {
        return requests.delete(`/contactlens/deletecontactlens/${id}`);
    },

    // ✅ Get a contact lens by brand slug
    getContactLensByBrandSlug: async (slug) => {
        return requests.get(`/contactlens/brand/${slug}`);
    },

    // ✅ Get contact lenses by category slug
    getContactLensByCategorySlug: async (slug) => {
        return requests.get(`/contactlens/category/${slug}`);
    },

    // ✅ Get brands by category
    getBrandsByCategory: async () => {
        return requests.get('/contactlens/contact-lenses/brands/category');
    },

    // ✅ Get lenses by slug
    getLensesBySlug: async (slug) => {
        return requests.get(`/contactlens/contact-lenses/${slug}`);
    }
};

export default ContactLensServices;