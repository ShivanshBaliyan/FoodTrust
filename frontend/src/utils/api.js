import apiClient from './apiClient';

export const analyzeApi = {
  analyze: async (text) => {
    return apiClient.post('/analyze', { text });
  },
};

export const storeApi = {
  addStore: async (storeData) => {
    return apiClient.post('/add_store', storeData);
  },
  getReviews: async (storeName) => {
    return apiClient.get(`/store_reviews/${storeName}`);
  },
};

export const feedbackApi = {
  submit: async (feedbackData) => {
    return apiClient.post('/feedback', feedbackData);
  },
};

export const recommendApi = {
  recommend: async (query, limit = 5) => {
    return apiClient.post('/recommend', { text: query, top_k: limit });
  },
};

export const reviewsApi = {
  getAll: async () => {
    return apiClient.get('/reviews');
  },
};
