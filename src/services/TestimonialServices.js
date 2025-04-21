import requests from "./httpService";

const TestimonialServices = {
    getAllTestimonials: async () => {
            return requests.get(`/testimonials/`);
        },
        
        getTestimonialsById: async (id) => {
            return requests.get(`/testimonials/${id}`);
        },
    
        createTestimonials: async (body) => {
            return requests.post("/testimonials/", body);
        },
    
        updateTestimonials: async (id, body) => {
            return requests.put(`/testimonials/${id}`, body);
        },
    
        deleteTestimonials: async (id) => {
            return requests.delete(`/testimonials/${id}`);
        },
};

export default TestimonialServices;