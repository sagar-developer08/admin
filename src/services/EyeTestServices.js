import requests from "./httpService";

const EyeTestServices = {
  getAllBookings: async () => {
    return requests.get(`/bookeye/`);
  },

  getBookingById: async (id) => {
    return requests.get(`/bookeye/${id}`);
  },
  
  createBooking: async (body) => {
    return requests.post("/bookeye/", body);
  },

  updateBooking: async (id, body) => {
    return requests.put(`/bookeye/${id}`, body);
  },

  deleteBooking: async (id) => {
    return requests.delete(`/bookeye/${id}`);
  },
};

export default EyeTestServices;