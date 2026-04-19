import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api/',
    headers: {
        'Content-Type': 'application/json'
    }
});

export const suggestDescription = async (partial) => {
    try {
        const response = await api.post('suggest/', { partial });
        return response.data.suggestions || [];
    } catch (error) {
        console.error("Error fetching suggestions:", error);
        return [];
    }
};

export const enhanceDescription = async (description) => {
    try {
        const response = await api.post('enhance/', { description });
        return response.data.enhanced || description;
    } catch (error) {
        console.error("Error enhancing description:", error);
        return description;
    }
};

export default api;